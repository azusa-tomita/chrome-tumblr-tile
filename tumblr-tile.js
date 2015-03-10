var tumblrTile;

tumblrTile || (function() {

    tumblrTile = {
        configNs       : "tumblr-tile",
        saveConfig     : saveConfig,
        loadConfig     : loadConfig,
        draw           : draw,
        getTumblrPhotos: getTumblrPhotos,
        config         : undefined,
    };

    function saveConfig(hash) {
        localStorage[this.configNs] = JSON.stringify(hash);
    }

    function loadConfig() {
        var configStr = localStorage[this.configNs];
        var config    = configStr ? JSON.parse(configStr) : {};

        var defaultConfig = {
            tagname : "%E6%96%B0%E5%9E%A3%E7%B5%90%E8%A1%A3",
            baseWidth: 250,
            margin   : 10
        };

        this.config = $.extend(defaultConfig, config);
    }
    function date(){
        var date = new Date();
        var year  = date.getFullYear();
        var month  = date.getMonth() + 1;
        var day    = date.getDate();
        var hour   = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        if (month < 10) {month = "0" + month;}
        if (day < 10) {day = "0" + day;}
        if (hour < 10) {hour = "0" + hour;}
        if (minute < 10) {minute = "0" + minute;}
        if (second < 10) {second = "0" + second;}
        var fullData = year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
        return Date.parse( fullData.replace( /-/g, '/') ) / 1000
    }
    function draw() {
        var self = this;
        var backCount = 1;


        self.loadConfig();

        if ( ! self.config.apiKey ) {
            console.log("not exists api key");
            return 1;
        }

        var param = {
            limit : 20,
            offset: 0,
        };

        var isAccessTumblr = false;

        self.getTumblrPhotos(param, function(div) {
            $("#container").append($(div));
        }).then(function() {

            param.offset += param.limit;

            $("#container").masonry({
                itemSelector: ".item",
                columnWidth: self.config.baseWidth + self.config.margin,
                isFitWidth: true,
                isAnimated: true
            });
        }).then(function() {
            $(window).scroll(function() {
                if ( isAccessTumblr == false && $(window).scrollTop() + $(window).height() >= $(document).height() ) {
                    console.log(param.ts);

                    param.ts = param.ts - (864000 * backCount);

                    isAccessTumblr = true;
                    var divs = "";

                    self.getTumblrPhotos(param, function(div) {
                        divs += div;
                    }).then(function() {

                        param.offset += param.limit;

                        var $divs = $(divs);
                        $("#container").append($divs).masonry( 'appended', $divs, false );

                    }).then(function() {
                        isAccessTumblr = false;
                    });
                    backCount++;
                }
            });
        });

    }

    function getTumblrPhotos(param, func) {

        var self = this;
        var d = $.Deferred();
        param.api_key = self.config.apiKey;
        var randomDate = 144000 * (1 + Math.floor( Math.random() * 100 ));
        param.ts = date() - randomDate;

        $.getJSON(
            "https://api.tumblr.com/v2/tagged?tag=" + self.config.tagname + "&api_key=" + param.api_key + "&before=" + param.ts,
            function(json) {
                json.response.forEach(function(val, index, array) {
                    if ( ! val.photos ) {
                        return 1;

                    }

                    var j    = 0;
                    var diffSizes = val.photos[0].alt_sizes.map(function(alt_size) {
                        return {
                            diffWidth: Math.abs(alt_size.width - self.config.baseWidth),
                            index    : j++,
                        };
                    })

                    diffSizes.sort(function(a, b) {
                        if ( a.diffWidth > b.diffWidth ) {
                            return 1;
                        }
                        else if ( a.diffWidth < b.diffWidth ) {
                            return -1;
                        }
                        return 0;
                    });

                    var altSize = val.photos[0].alt_sizes[diffSizes[0].index]
                    var div = '<div class="item"><img src="' + altSize.url+ '" width="' + altSize.width + '" height="' + altSize.height + '" /></div>';

                    func(div);
                });

                d.resolve();
            }
        );
        return d;
    }

})();
