/**
 * POST/PUT data from Alpaca form
 * @returns false
 */
var postRenderAlpaca = function(renderedForm) {
    $('#btn_module_submit').click(function() {
        var data = postRenderAlpacaData(renderedForm);
        var url = config_data.cfg.server_url + config_data.cfg.api['instances'] + (data.instanceId > 0 ? '/' + data.instanceId : '');
        var type = (data.instanceId > 0 ? 'PUT' : 'POST');
        // submit via ajax
        $.ajax({
            type: type,
            cache: false,
            url: url,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(data),
            beforeSend: function() {
                $('.module-spinner').show();
            },
            success: function(response) {
                 $('.module-spinner').fadeOut();
                 window.location.replace("#apps");
            },
            error: function(xhr, ajaxOptions, thrownError) {
                 $('.module-spinner').fadeOut();
                if (xhr.status && xhr.status == 400) {
                    alert(xhr.responseText);
                } else {
                    alert("Something went wrong");
                }
            }
        });
        return false;
    });
};
/**
 * Build form data
 * @returns {Object}
 */
function postRenderAlpacaData(renderedForm) {
    var defaults = ['instanceId', 'moduleId', 'active', 'title', 'description'];
    var alpacaData = {'params': renderedForm.getValue()};
    var formData = $('#form_module').serializeArray();
    var inputData = {};
    //var thestr = JSON.stringify(renderedForm.getValue());

    $.each(formData, function(k, v) {
        if (defaults.indexOf(v.name) > -1) {
            inputData[v.name] = v.value;
        }

    });
    //$.merge(inputData, alpacaData);
    return $.extend(inputData, alpacaData);
}