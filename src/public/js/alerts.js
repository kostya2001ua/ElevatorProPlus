var $successAlert, $errorAlert;

function showSuccessAlert(message) {
    $successAlert = $('#success-alert');
    $successAlert.find('.alert-message').text(message);
    $successAlert.removeClass('d-none');
    if($errorAlert && $errorAlert.length) {
        $errorAlert.addClass('d-none');
    }
}

function showErrorAlert(message) {
    $errorAlert = $('#error-alert');
    $errorAlert.find('.alert-message').text(message);
    $errorAlert.removeClass('d-none');
    if($successAlert && $successAlert.length) {
        $successAlert.addClass('d-none');
    }
}