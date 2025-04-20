// assets/js/script.js
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a page that needs Markdown content
    const markdownContainer = document.getElementById('markdown-content');
    const sidebarContainer = document.getElementById('sidebar-content');
    const footerContainer = document.getElementById('footer-content');

    if (markdownContainer) {
        // Fetch the Markdown file
        fetch('./content.md')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Markdown file not found');
                }
                return response.text();
            })
            .then(markdown => {
                // Split Markdown into main, sidebar, and footer content
                const mainStart = '<!-- Main Column Start -->';
                const mainEnd = '<!-- Main Column End -->';
                const sidebarStart = '<!-- Sidebar Start -->';
                const sidebarEnd = '<!-- Sidebar End -->';

                const mainStartIndex = markdown.indexOf(mainStart);
                const mainEndIndex = markdown.indexOf(mainEnd);
                const sidebarStartIndex = markdown.indexOf(sidebarStart);
                const sidebarEndIndex = markdown.indexOf(sidebarEnd);

                let mainContent = '';
                let sidebarContent = '';
                let footerContent = '';

                if (
                    mainStartIndex !== -1 &&
                    mainEndIndex !== -1 &&
                    sidebarStartIndex !== -1 &&
                    sidebarEndIndex !== -1 &&
                    mainStartIndex < mainEndIndex &&
                    sidebarStartIndex < sidebarEndIndex &&
                    mainEndIndex < sidebarStartIndex
                ) {
                    mainContent = markdown.slice(mainStartIndex + mainStart.length, mainEndIndex);
                    sidebarContent = markdown.slice(sidebarStartIndex + sidebarStart.length, sidebarEndIndex);
                    footerContent = markdown.slice(sidebarEndIndex + sidebarEnd.length);
                } else {
                    mainContent = markdown;
                }

                // Parse Markdown to HTML
                const mainHtml = marked.parse(mainContent.trim(), { gfm: true, breaks: true });
                const sidebarHtml = sidebarContent ? marked.parse(sidebarContent.trim(), { gfm: true, breaks: true }) : '';
                const footerHtml = footerContent ? marked.parse(footerContent.trim(), { gfm: true, breaks: true }) : '';

                // Inject HTML into containers
                markdownContainer.innerHTML = mainHtml || '<p>No main content available.</p>';
                if (sidebarContainer) {
                    sidebarContainer.innerHTML = sidebarHtml || '<p>No sidebar content available.</p>';
                }
                if (footerContainer) {
                    footerContainer.innerHTML = footerHtml || '<p>No footer content available.</p>';
                }

                // Apply custom styling
                styleMarkdownContent();
            })
            .catch(error => {
                console.error('Error loading Markdown:', error);
                markdownContainer.innerHTML = '<p>Error loading content. Please try again later.</p>';
            });
    }

    // Function to apply Wempecker-specific styling
    function styleMarkdownContent() {
        const mainContent = document.getElementById('markdown-content');
        const sidebarContent = document.getElementById('sidebar-content');
        const footerContent = document.getElementById('footer-content');

        // Style content for a given container
        function styleContainer(content) {
            if (!content) return;

            // Style blockquotes
            content.querySelectorAll('blockquote').forEach(quote => {
                quote.classList.add('xblog-quote');
            });

            // Style images and captions
            content.querySelectorAll('img').forEach(img => {
                const wrapper = document.createElement('div');
                wrapper.classList.add('xblog-image-wrapper');

                // Ensure the image has the correct class and styling
                img.classList.add('xblog-img-fixed');
                img.style.display = 'block';
                img.style.margin = '0 auto';

                // Since the <img> is wrapped in a <p>, look for the caption within the same parent <p>
                let parent = img.parentElement;
                let captionText = null;
                let captionNode = null;

                // Check for an <em> element within the same parent <p>
                let sibling = img.nextSibling; // Start with the node after the <img>
                while (sibling) {
                    if (sibling.nodeName === 'EM') {
                        captionText = sibling.textContent;
                        captionNode = sibling;
                        break;
                    } else if (sibling.nodeName === 'BR') {
                        // Skip <br> tags and continue looking for an <em>
                        sibling = sibling.nextSibling;
                        continue;
                    }
                    sibling = sibling.nextSibling;
                }

                // If no <em> found in the same <p>, check the parent's next sibling
                if (!captionText && parent) {
                    let nextSibling = parent.nextElementSibling;
                    while (nextSibling) {
                        if (nextSibling.tagName === 'P') {
                            const emChild = nextSibling.querySelector('em');
                            if (emChild) {
                                captionText = emChild.textContent;
                                captionNode = nextSibling;
                                break;
                            }
                        }
                        nextSibling = nextSibling.nextElementSibling;
                    }
                }

                // Debug logs to inspect the image, parent, sibling, and caption text
                console.log('Image:', img);
                console.log('Parent:', parent);
                console.log('Sibling:', sibling);
                console.log('Next Sibling:', parent ? parent.nextElementSibling : null);
                console.log('Caption Text:', captionText);

                if (captionText && captionNode) {
                    const captionDiv = document.createElement('div');
                    captionDiv.classList.add('xblog-img-caption');
                    captionDiv.textContent = captionText;
                    captionDiv.style.display = 'block';
                    captionDiv.style.width = '100%';
                    captionDiv.style.textAlign = 'center';

                    // Append image and caption to the wrapper
                    wrapper.appendChild(img.cloneNode(true));
                    wrapper.appendChild(captionDiv);

                    // Replace the image with the wrapper and remove the caption node
                    img.parentNode.replaceChild(wrapper, img);
                    if (captionNode.nodeName === 'EM') {
                        captionNode.remove(); // Remove the <em> if it was within the same <p>
                    } else {
                        captionNode.remove(); // Remove the separate <p> if it was a sibling
                    }
                } else {
                    wrapper.appendChild(img.cloneNode(true));
                    img.parentNode.replaceChild(wrapper, img);
                }
            });

            // Style lists
            content.querySelectorAll('ul').forEach(list => {
                list.classList.add('xblog-list');
                list.querySelectorAll('li').forEach(item => {
                    item.classList.add('list-item');
                });
            });

            // Style tables
            content.querySelectorAll('table').forEach(table => {
                table.classList.add('xblog-table');
                table.querySelectorAll('th').forEach(th => {
                    th.classList.add('xblog-table-header');
                });
                table.querySelectorAll('td').forEach(td => {
                    td.classList.add('xblog-table-cell');
                    if (td.textContent.trim() === 'Free Space') {
                        td.classList.add('free-space');
                    }
                    // Add interactivity to bingo cells
                    td.addEventListener('click', () => {
                        td.classList.toggle('marked');
                    });
                });
            });

            // Style headings
            content.querySelectorAll('h1').forEach(h1 => {
                h1.classList.add('xblog-post-title');
            });
            content.querySelectorAll('h2').forEach(h2 => {
                h2.classList.add('xblog-section-heading');
                // Style coupons
                if (h2.textContent.toLowerCase().includes('coupon')) {
                    const nextQuote = h2.nextElementSibling;
                    if (nextQuote && nextQuote.tagName === 'BLOCKQUOTE') {
                        nextQuote.classList.add('xblog-coupon');
                    }
                }
            });
        }

        // Style contributors section
        footerContent.querySelectorAll('h2').forEach(h2 => {
            if (h2.textContent.toLowerCase().includes('contributors')) {
                h2.parentElement.classList.add('xblog-contributors');
            }
        });

        // Apply styles to all containers
        styleContainer(mainContent);
        styleContainer(sidebarContent);
        styleContainer(footerContent);
    }
});