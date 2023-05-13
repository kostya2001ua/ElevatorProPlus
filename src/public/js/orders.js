$(document).ready(function () {
    $(document).on('change', '#new-li-qty, #new-li-product', function () {
        var qty = $('#new-li-qty').val();
        var price = $('#new-li-product').find(':selected').data('price');
        if (qty && price) {
            showTotalLiPrice(price, qty);
        }
    });

    $(document).on('change', '#order-new-li-product', function () {
        var price = $(this).find(':selected').data('price');
        $('#order-new-li-price').text(price + ' UAH');
    });
    $(document).on('change', '#order-new-li-qty, #order-new-li-product', function () {
        var qty = $('#order-new-li-qty').val();
        var price = $('#order-new-li-product').find(':selected').data('price');
        if (qty && price) {
            showTotalLiPrice(price, qty);
            $('#order-add-product-btn').removeAttr('disabled');
        } else {
            $('#new-li-total').text('');
            $('#order-add-product-btn').attr('disabled', true);
        }
    });
    $(document).on('click', '#order-add-product-btn', function() {
        var url = $(this).data('url');
        var productId = $('#order-new-li-product').val();
        var qty = $('#order-new-li-qty').val();
        $.ajax({
            method: 'POST',
            url: url,
            data: {
                productId: productId,
                quantity: qty
            },
            complete: function(response) {
                if(response.responseJSON.success) {
                    location.reload(); 
                } else {
                    showErrorAlert(response.responseJSON.message);
                }
            }
        })
    });
    $(document).on('click', '.delete-line-item', function() {
        var url = $(this).data('url');
        $.ajax({
            method: 'POST',
            url: url,
            complete: function(response) {
                if(response.responseJSON.success) {
                    location.reload(); 
                } else {
                    showErrorAlert(response.responseJSON.message);
                }
            }
        })
    });

    $(document).on('click', '.change-status-button', function () {
        var newStatus = $(this).data('status');
        var url = $(this).data('url');
        $.ajax({
            url: url,
            method: 'POST',
            data: {
                status: newStatus
            },
            complete: function(response) {
                if(response.responseJSON.success) {
                    location.reload(); 
                } else {
                    showErrorAlert(response.responseJSON.message);
                }
            }
        })
    });
});

function showTotalLiPrice(price, qty) {
    var total = qty * price;
    $('#new-li-total').text(total + ' UAH');
}
