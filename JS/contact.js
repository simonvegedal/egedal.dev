// Enhanced Contact Form Script with Custom Alert and IP Logging
        const firebaseConfig = {
            apiKey: "AIzaSyB9VbCbqfKrfoCmX6kae_-N_UyHpBUjIjA",
            authDomain: "contact-egedal-devlopment.firebaseapp.com",
            projectId: "contact-egedal-devlopment",
            storageBucket: "contact-egedal-devlopment.firebasestorage.app",
            messagingSenderId: "1091720412185",
            appId: "1:1091720412185:web:aa2215a16a71d4e379be88",
            measurementId: "G-CFV31057M4"
        };

        let db;
        let isFirebaseReady = false;
        let userIP = null;

        // Function to get user's IP address
        async function getUserIP() {
            try {
                // Method 1: Using ipify API (most reliable)
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return data.ip;
            } catch (error) {
                console.log('Primary IP service failed, trying backup...');
                
                try {
                    // Backup Method: Using ipapi.co
                    const response = await fetch('https://ipapi.co/json/');
                    const data = await response.json();
                    return data.ip;
                } catch (backupError) {
                    console.log('Backup IP service failed, trying final method...');
                    
                    try {
                        // Final backup: Using jsonip.com
                        const response = await fetch('https://jsonip.com/');
                        const data = await response.json();
                        return data.ip;
                    } catch (finalError) {
                        console.error('All IP services failed:', finalError);
                        return 'Unable to detect';
                    }
                }
            }
        }

        // Custom Alert Functions
        function createCustomAlert() {
            // Check if alert already exists
            if (document.getElementById('customAlert')) {
                return;
            }

            const alertHTML = `
                <div id="customAlert" class="custom-alert-overlay">
                    <div class="custom-alert-modal">
                        <div class="custom-alert-content">
                            <div class="custom-alert-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="custom-alert-message">
                                <h3>Success!</h3>
                                <p>Message sent successfully! Thank you for reaching out. I'll get back to you soon!</p>
                            </div>
                            <button class="custom-alert-button" onclick="closeCustomAlert()">
                                <i class="fas fa-thumbs-up"></i> Awesome!
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', alertHTML);

            // Add CSS styles
            const style = document.createElement('style');
            style.textContent = `
                .custom-alert-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(5px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    opacity: 0;
                    animation: fadeIn 0.3s ease-out forwards;
                }

                .custom-alert-modal {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 20px;
                    padding: 3px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    transform: scale(0.8);
                    animation: slideIn 0.3s ease-out forwards;
                    max-width: 400px;
                    width: 90%;
                }

                .custom-alert-content {
                    background: white;
                    border-radius: 17px;
                    padding: 40px 30px;
                    text-align: center;
                    position: relative;
                }

                .custom-alert-icon {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    box-shadow: 0 10px 30px rgba(79, 172, 254, 0.3);
                }

                .custom-alert-icon i {
                    font-size: 35px;
                    color: white;
                    animation: bounce 0.6s ease-in-out;
                }

                .custom-alert-message h3 {
                    font-size: 28px;
                    color: #333;
                    margin: 0 0 15px 0;
                    font-weight: 700;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .custom-alert-message p {
                    font-size: 16px;
                    color: #666;
                    margin: 0 0 30px 0;
                    line-height: 1.5;
                }

                .custom-alert-button {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 50px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
                    min-width: 150px;
                }

                .custom-alert-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
                }

                .custom-alert-button:active {
                    transform: translateY(0);
                }

                .custom-alert-button i {
                    margin-right: 8px;
                }

                @keyframes fadeIn {
                    to { opacity: 1; }
                }

                @keyframes slideIn {
                    to { transform: scale(1); }
                }

                @keyframes bounce {
                    0%, 20%, 60%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    80% { transform: translateY(-5px); }
                }

                @media (max-width: 480px) {
                    .custom-alert-content {
                        padding: 30px 20px;
                    }
                    
                    .custom-alert-message h3 {
                        font-size: 24px;
                    }
                    
                    .custom-alert-message p {
                        font-size: 14px;
                    }
                }
            `;
            
            document.head.appendChild(style);
        }

        function showCustomAlert() {
            createCustomAlert();
            const alert = document.getElementById('customAlert');
            if (alert) {
                alert.style.display = 'flex';
            }
        }

        function closeCustomAlert() {
            const alert = document.getElementById('customAlert');
            if (alert) {
                alert.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => {
                    alert.remove();
                }, 300);
            }
        }

        // Add fadeOut animation
        document.addEventListener('DOMContentLoaded', function() {
            const style = document.createElement('style');
            style.textContent += `
                @keyframes fadeOut {
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        });

        function showStatus(message, isError = false) {
            const statusDiv = document.getElementById('statusMessage');
            if (statusDiv) {
                statusDiv.className = `status-message ${isError ? 'status-error' : 'status-success'}`;
                statusDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
                statusDiv.style.display = 'block';
            }
        }

        // Initialize Firebase when DOM is loaded
        document.addEventListener('DOMContentLoaded', async function() {
            // Initialize Firebase
            if (typeof firebase !== 'undefined') {
                try {
                    if (!firebase.apps.length) {
                        firebase.initializeApp(firebaseConfig);
                    }
                    db = firebase.firestore();
                    isFirebaseReady = true;
                    console.log('Firebase initialized successfully');
                } catch (error) {
                    console.error('Firebase initialization failed:', error);
                }
            }

            // Get user's IP address on page load
            console.log('Fetching user IP address...');
            userIP = await getUserIP();
            console.log('User IP detected:', userIP);

            // Setup contact form
            setupContactForm();
        });

        function setupContactForm() {
            const form = document.getElementById('contactForm');
            
            if (!form) {
                console.error('Contact form not found');
                return;
            }

            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                if (!isFirebaseReady) {
                    showStatus('Service temporarily unavailable. Please try again later.', true);
                    return;
                }

                // Get form values
                const nameField = document.getElementById('nameField');
                const emailField = document.getElementById('emailField');
                const messageField = document.getElementById('messageField');
                const submitBtn = document.getElementById('submitBtn');

                if (!nameField || !emailField || !messageField) {
                    showStatus('Form error. Please refresh the page and try again.', true);
                    return;
                }

                const name = nameField.value.trim();
                const email = emailField.value.trim();
                const message = messageField.value.trim();

                // Validation
                if (!name || !email || !message) {
                    showStatus('Please fill in all fields', true);
                    return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showStatus('Please enter a valid email address', true);
                    return;
                }

                // Show loading state
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                try {
                    // If IP wasn't fetched earlier, try to get it now
                    if (!userIP || userIP === 'Unable to detect') {
                        console.log('Attempting to fetch IP address again...');
                        userIP = await getUserIP();
                    }

                    // Prepare data with IP address
                    const contactData = {
                        name: name,
                        email: email,
                        message: message,
                        ipAddress: userIP || 'Unable to detect',
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        created: new Date().toISOString(),
                        userAgent: navigator.userAgent,
                        url: window.location.href,
                        // Additional metadata that might be useful
                        referrer: document.referrer || 'Direct visit',
                        screenResolution: `${screen.width}x${screen.height}`,
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        language: navigator.language
                    };

                    // Save to Firestore
                    await db.collection('contacts').add(contactData);

                    // Show beautiful custom alert
                    showCustomAlert();
                    form.reset();

                    // Log successful submission (for debugging)
                    console.log('Contact form submitted successfully with IP:', userIP);

                } catch (error) {
                    console.error('Error saving message:', error);

                    let errorMsg = "Failed to send message. ";
                    if (error.code === 'permission-denied') {
                        errorMsg += "Please try again or contact me directly via email.";
                    } else if (error.code === 'unavailable') {
                        errorMsg += "Service temporarily unavailable. Please try again later.";
                    } else {
                        errorMsg += "Please try again or contact me directly via email.";
                    }

                    showStatus(errorMsg, true);
                } finally {
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            });
        }