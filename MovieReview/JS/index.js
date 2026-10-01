// Retrieve saved movie reviews from localStorage or an empty array to store movies
var userReviews = JSON.parse(localStorage.getItem("movieReviews")) || [];

// Load user reviews from localStorage
function loadUserReviews() {
  userReviews = JSON.parse(localStorage.getItem("movieReviews")) || [];
  return userReviews; 
}

// Display the list of saved reviews inside reviewsContainer, if no container then stop function
function displayReviews(userReviews) {
  var container = document.getElementById("reviewsContainer");
  if (!container) return; 

  // If there are no reviews, show a message
  if (userReviews.length === 0) {
    container.innerHTML = "<p>No reviews submitted yet.</p>";
    return;
  }

  // Build html string with each review card
  var html = "";
  for (var i = 0; i < userReviews.length; i++) {
    var r = userReviews[i];
    html +=
      '<div class="review-card" data-index="' + i + '">' +
        '<h3>' + r.title + ' (' + r.genre + ')</h3>' +
        '<p><strong>Rating:</strong> ' + "★".repeat(r.rating) + "☆".repeat(5 - r.rating) + '</p>' +
        '<p><strong>Review:</strong> ' + r.text + '</p>' +
        '<button onclick="deleteReview(' + i + ')">Delete</button>' +
      '</div>';
  }
  // Inserts the html into the container
  container.innerHTML = html; 
}

// Save a new review from the form inputs
function saveReview() {
  // Get values from the form inputs and trims it
  var title = document.getElementById("movieTitle").value.trim();
  var genre = document.getElementById("genre").value;
  var ratingInput = document.querySelector('input[name="rating"]:checked');
  var text = document.getElementById("reviewText").value.trim();

  // Validate that all required fields have values
  if (!title || !genre || !ratingInput || !text) {
    alert("Please fill all required fields.");
    return;
  }

  // Convert rating to a number
  var rating = Number(ratingInput.value); 

  // Load current reviews, add new review to array, save back to localStorage
  var reviews = loadUserReviews();
  reviews.push({ title: title, genre: genre, rating: rating, text: text });
  localStorage.setItem("movieReviews", JSON.stringify(reviews));

  alert("Review saved!");
  document.getElementById("movieReviewForm").reset();
  displayReviews(reviews);
}

// Delete a review by its index in the array
function deleteReview(index) {
  var reviews = loadUserReviews();
  reviews.splice(index, 1);
  localStorage.setItem("movieReviews", JSON.stringify(reviews));
  displayReviews(reviews);
}

// Search for a movie and show its info with user reviews for it
function searchMovie() {
  var searchInput = document.getElementById("movieSearch");
  var reviewsList = document.getElementById("reviewsList");
  if (!searchInput || !reviewsList) return; 

  var title = searchInput.value.trim();
  if (!title) {
    alert("Please enter a movie title.");
    return;
  }

  reviewsList.innerHTML = "Loading..."; 

  // Fetch API
  fetch("https://www.omdbapi.com/?apikey=52bc39c3&t=" + encodeURIComponent(title))
    .then(function(response) {
      if (!response.ok) throw new Error("OMDb network response was not ok");
      return response.json();
    })
    .then(function(movie) {
      if (movie.Response === "False") {
        reviewsList.innerHTML = "Movie not found.";
        throw "stop";
      }

      // Load current user reviews from localStorage again
      userReviews = JSON.parse(localStorage.getItem("movieReviews")) || [];

      var movieTitleLower = movie.Title.toLowerCase();

      // Filter reviews by matching the movie title 
      var filteredUserReviews = [];
      for (var i = 0; i < userReviews.length; i++) {
        if (userReviews[i].title.toLowerCase() === movieTitleLower) {
          filteredUserReviews.push(userReviews[i]);
        }
      }

      // Build htmlto display movie info
      var movieHTML =
        "<h2>" + movie.Title + "</h2>" +
        '<img src="' + (movie.Poster !== "N/A" ? movie.Poster : "") + '" class="poster" alt="Movie Poster" />' +
        "<p><b>Genre:</b> " + movie.Genre + "</p>" +
        "<p><b>IMDb Rating:</b> " + movie.imdbRating + "</p>" +
        "<p>" + movie.Plot + "</p>";

      // Build html to display filtered user reviews
      var userReviewsHTML = "<h3>Your Reviews</h3>";
      if (filteredUserReviews.length === 0) {
        userReviewsHTML += "<p>No user reviews yet.</p>";
      } else {
        for (var j = 0; j < filteredUserReviews.length; j++) {
          var r = filteredUserReviews[j];
          userReviewsHTML +=
            '<div class="review-card">' +
            "<p><b>Rating:</b> " + "★".repeat(r.rating) + "</p>" +
            "<p>" + r.text + "</p>" +
            "</div>";
        }
      }

      // Insert the combined movie info and user reviews into the page
      reviewsList.innerHTML = movieHTML + userReviewsHTML;
    })
    .catch(function(error) {
      if (error !== "stop") {
        console.error("Fetch error:", error);
        reviewsList.innerHTML = "An error occurred while fetching data.";
      }
    });
}

// Event listeners 
window.addEventListener("DOMContentLoaded", function() {
  // Display existing reviews on page load
  displayReviews(loadUserReviews());

  // Added submit event listener to the review form
  var form = document.getElementById("movieReviewForm");
  if (form) {
    form.addEventListener("submit", function(e) {
      // Prevents the page from reloading 
      e.preventDefault();
      saveReview();
    });
  }

  // Added click event listener to the search button
  var searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", searchMovie);
  }

  window.deleteReview = deleteReview;
});
