// Set the image source on the post page based on the URL parameter
const urlParams = new URLSearchParams(window.location.search);
const imgSrc = urlParams.get('img');
document.getElementById('postImage').src = imgSrc;

document.addEventListener("DOMContentLoaded", function() {
    const likesCountElement = document.getElementById("likesCount");
    const thumbUpButton = document.getElementById("thumbUp");
    const thumbDownButton = document.getElementById("thumbDown");
    const commentButton = document.getElementById("commentButton");
    const reviewSection = document.getElementById("reviewSection");
    const submitReviewButton = document.getElementById("submitReview");
    const reviewCountElement = document.getElementById("reviewCount");
    const reviewText = document.getElementById("reviewText");
    const toggleReviewsButton = document.getElementById("toggleReviews");
    const reviewsList = document.getElementById("reviewsList");
    const backButton=document.getElementById("backButton");

    let likesCount = parseInt(likesCountElement.textContent);
    let reviewCount = parseInt(reviewCountElement.textContent);
    let liked = false;
    let disliked = false;

    // Thumbs up and thumbs down logic
    thumbUpButton.addEventListener("click", function() {
        if (!liked && !disliked) {
            likesCount++;
            liked = true;
            thumbUpButton.classList.add("active");
        } else if (disliked) {
            likesCount += 2;
            disliked = false;
            liked = true;
            thumbDownButton.classList.remove("active");
            thumbUpButton.classList.add("active");
        } else if (liked) {
            likesCount--;
            liked = false;
            thumbUpButton.classList.remove("active");
        }
        likesCountElement.textContent = likesCount;
    });

    thumbDownButton.addEventListener("click", function() {
        if (!liked && !disliked) {
            likesCount--;
            disliked = true;
            thumbDownButton.classList.add("active");
        } else if (liked) {
            likesCount -= 2;
            liked = false;
            disliked = true;
            thumbUpButton.classList.remove("active");
            thumbDownButton.classList.add("active");
        } else if (disliked) {
            likesCount++;
            disliked = false;
            thumbDownButton.classList.remove("active");
        }
        likesCountElement.textContent = likesCount;
    });

    // Show review text box when comment button is clicked
    commentButton.addEventListener("click", function() {
        if (reviewSection.style.display === "none") {
            reviewSection.style.display = "block";
        } else {
            reviewSection.style.display = "none";
        }
    });

    // Submit review and update review count
    submitReviewButton.addEventListener("click", function() {
        if (reviewText.value.trim() !== "") {
            reviewCount++;
            reviewCountElement.textContent = reviewCount;
            reviewText.value = ""; // Clear the text area
            reviewSection.style.display = "none"; // Hide the review section

            // Add the new review to the reviews list
            const newReview = document.createElement("div");
            newReview.classList.add("review");
            newReview.textContent = `Review ${reviewCount}: ${reviewText.value.trim()}`;
            reviewsList.appendChild(newReview);
        }
    });

    // Toggle visibility of reviews list when "See the reviews" is clicked
    toggleReviewsButton.addEventListener("click", function() {
        if (reviewsList.style.display === "none") {
            reviewsList.style.display = "block";
            toggleReviewsButton.textContent = "Hide the reviews"; // Change text to "Hide the reviews"
        } else {
            reviewsList.style.display = "none";
            toggleReviewsButton.textContent = "See the reviews"; // Change text back to "See the reviews"
        }
    });

    backButton.addEventListener("click", function() {
        window.location.href = "feed.html"; // Replace with the correct path if feed.html is in a different directory
    });
});
