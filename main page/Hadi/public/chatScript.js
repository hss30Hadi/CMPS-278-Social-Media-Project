document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.friend').forEach(friend => {
        friend.addEventListener('click', function() {
            // Hide the logo and show the chat interface
            document.querySelector('.chat-logo').style.display = 'none';
            document.querySelector('.chat-header').style.display = 'block';
            document.querySelector('.chat-messages').style.display = 'block';
            document.querySelector('.message-input').style.display = 'flex';

            // Remove the active class from all friends and add to clicked one
            document.querySelectorAll('.friend').forEach(f => f.classList.remove('active'));
            this.classList.add('active');

            // Update the chat header with the friend's name
            const friendName = this.querySelector('.friend-name').textContent;
            document.querySelector('.chat-header h3').textContent = friendName;

            // Optionally update chat messages dynamically
            document.querySelector('.chat-messages').innerHTML = `
                <div class="user-message">
                    <p>You: What's new, ${friendName}?</p>
                </div>
                <div class="friend-message">
                    <p>${friendName}: Just finished an amazing meal!</p>
                </div>
            `;
        });
    });
});
function sendMessage(event) {
    event.preventDefault(); // Prevent the form from submitting which would reload the page
    
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    if (message === '') {
        return false; // Do nothing if the message is empty
    }

    const chatMessages = document.querySelector('.chat-messages');
    const newMessageDiv = document.createElement('div');
    newMessageDiv.classList.add('user-message');

    const newMessage = document.createElement('p');
    newMessage.textContent = `You: ${message} `; // Add a space after the message text

    // Create and append the timestamp within the same <p>
    const timestamp = document.createElement('span');
    timestamp.className = 'timestamp';
    timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    newMessage.appendChild(timestamp); // Append the timestamp to the <p> tag

    newMessageDiv.appendChild(newMessage);
    chatMessages.appendChild(newMessageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    input.value = ''; // Clear the input field after sending the message
    return false; // Return false to prevent traditional form submission
}

