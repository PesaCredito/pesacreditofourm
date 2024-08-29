const adminWalletAddress = 'F7D98a3kK2igaNDM2BQUNr7wrajuEeThENs7fzAU5UiZ';
const userLikes = {}; // Object to track likes by user and post

document.getElementById('login-button').addEventListener('click', async function() {
    try {
        const response = await window.solana.connect();
        const walletAddress = response.publicKey.toString();
        console.log('Connected with wallet: ', walletAddress);
        
        // Display the wallet address in the header
        const loginButton = document.getElementById('login-button');
        loginButton.textContent = `Wallet: ${walletAddress}`;
        loginButton.disabled = true; // Disable the button after successful connection

        // Store the wallet address for further use
        window.userWalletAddress = walletAddress;

    } catch (err) {
        console.error('Login failed:', err);
    }
});

document.getElementById('post-button').addEventListener('click', function() {
    if (!window.userWalletAddress) {
        alert('Please connect your Phantom Wallet to post.');
        return;
    }

    const postContent = document.getElementById('new-post-content').value;
    if (postContent) {
        const postId = `post-${Date.now()}`; // Unique ID for each post

        // Create a new post element
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.dataset.postId = postId; // Set the post's unique ID
        postElement.innerHTML = `
            <p><strong>${window.userWalletAddress}</strong></p>
            <p>${postContent}</p>
            <button class="like-button">Like</button> <span class="like-count">0</span>
            <button class="report-button" style="color: red; font-size: smaller; margin-left: 10px; background: none; border: none; cursor: pointer;">Report</button>
            <div class="comments"></div>
            <input class="comment-input" placeholder="Add a comment..." />
            <button class="comment-button">Comment</button>
        `;

        // Determine where to add the post (Admin or regular feed)
        if (window.userWalletAddress === adminWalletAddress) {
            // Add post to the admin posts section
            const adminPostsContainer = document.getElementById('admin-posts');
            adminPostsContainer.appendChild(postElement);
        } else {
            // Add post to the top of the posts container
            const postsContainer = document.getElementById('posts-container');
            postsContainer.insertBefore(postElement, postsContainer.firstChild);
        }

        // Clear the input field
        document.getElementById('new-post-content').value = '';

        // Add event listeners for the like and comment buttons
        addPostEventListeners(postElement, postId);
    }
});

function addPostEventListeners(postElement, postId) {
    // Initialize the likes for the post if not already done
    if (!userLikes[postId]) {
        userLikes[postId] = new Set();
    }

    // Like button functionality
    postElement.querySelector('.like-button').addEventListener('click', function() {
        const walletAddress = window.userWalletAddress;

        if (userLikes[postId].has(walletAddress)) {
            alert('You have already liked this post.');
        } else {
            const likeCountSpan = postElement.querySelector('.like-count');
            let likeCount = parseInt(likeCountSpan.textContent);
            likeCountSpan.textContent = likeCount + 1;

            // Add the user's wallet address to the set of users who liked the post
            userLikes[postId].add(walletAddress);
        }
    });

    // Report button functionality (only allows admin wallet to delete posts)
    postElement.querySelector('.report-button').addEventListener('click', function() {
        const walletAddress = window.userWalletAddress;

        if (walletAddress === adminWalletAddress) {
            if (confirm('Are you sure you want to delete this post?')) {
                postElement.remove(); // Remove the post from the DOM
                delete userLikes[postId]; // Clean up the likes for this post
            }
        } else {
            alert('You are not authorized to report this post.');
        }
    });

    // Comment functionality
    postElement.querySelector('.comment-button').addEventListener('click', function() {
        const commentInput = postElement.querySelector('.comment-input');
        const commentText = commentInput.value;
        if (commentText) {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.textContent = commentText;
            postElement.querySelector('.comments').appendChild(commentElement);
            commentInput.value = '';
        }
    });
}
