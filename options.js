$(function() {

    tumblrTile.loadConfig();

    var $apiKey    = $('#setting input[name="apiKey"]');
    var $tagname  = $('#setting input[name="tagname"]');
    var $baseWidth = $('#setting input[name="baseWidth"]');
    var $margin    = $('#setting input[name="margin"]');

    $apiKey.val(tumblrTile.config.apiKey);
    $tagname.val(tumblrTile.config.tagname);
    $baseWidth.val(tumblrTile.config.baseWidth);
    $margin.val(tumblrTile.config.margin);

    $("#setting").submit(function() {
        var hash = {
            apiKey   : $apiKey.val(),
            tagname : $tagname.val(),
            baseWidth: parseInt($baseWidth.val()),
            margin   : parseInt($margin.val())
        };

        tumblrTile.saveConfig(hash);
        return false;
    });
});
