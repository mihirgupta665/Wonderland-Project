(function () {
    'use strict';

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation');

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    // Valid form, show full-screen loading spinner
                    const overlay = document.getElementById('loading-overlay');
                    if (overlay) {
                        overlay.classList.remove('d-none');
                    }
                }
                form.classList.add('was-validated');
            }, false);
        });

    // Automatically hide flash alert messages after 5 seconds
    const alerts = document.querySelectorAll('.alert-dismissible');
    alerts.forEach(function (alert) {
        setTimeout(function () {
            // Use Bootstrap native Alert close method if available
            if (typeof bootstrap !== 'undefined' && bootstrap.Alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            } else {
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 500);
            }
        }, 5000);
    });

    // Ensure smooth scroll to top on page load/navigation
    window.addEventListener('DOMContentLoaded', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();