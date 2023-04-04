$(document).ready(function () {
    $('.data-table').each(function () {
        $(this).dataTable();
    });
    $(document).on('click', '.data-table tr', function () {
        if ($(this).data('href')) {
            location.href = $(this).data('href');
        }
    });
});