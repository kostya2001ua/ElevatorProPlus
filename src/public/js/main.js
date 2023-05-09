$(document).ready(function () {
    $('.data-table').each(function () {
        $(this).dataTable();
    });
    $(document).on('click', '.data-table tr', function () {
        if ($(this).data('href')) {
            location.href = $(this).data('href');
        }
    });

    $(document).on('click', '.js--delete-inv-record', function() {
        if(!confirm('Are you sure you want to delete inventory record?')) {
            return;
        }
        var $deleteButton = $(this);
        var url = $deleteButton.data('url');
        $.ajax({
            url: url,
            method: 'POST',
        }).done(function(response) {
            if(response.success) {
                $deleteButton.closest('tr').remove()
                $('#js-inv-record-deleted-alert').removeClass('d-none');
                setTimeout(function() {
                    $('#js-inv-record-deleted-alert').addClass('d-none');
                }, 4000)
                if($('.js--inventory-allocation').length > 0) {
                    $('.js--inventory-allocation').text('Allocation: '+ response.newAllocationString);
                }
            }
        })
    });

    $(document).on('submit', '.ajax-form', function(e) {
        e.preventDefault();
        var $form = $(this);
        $.ajax({
            method: $form.attr('method'),
            url: $form.attr('action'),
            data: $form.serialize(),
            success: function(response) {
                if(response.success) {
                    showSuccessAlert(response.message);             
                } else {
                    showErrorAlert(response.message);
                }
            }
        });
    });
});
