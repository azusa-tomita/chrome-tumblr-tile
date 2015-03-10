$(function() {
  $('input').click(function (E) {
    E.stopPropagation();
  });
  $('.save input').click(function () {
    location.reload();
  });
  $('.close').click(function (E) {
    $(this).hide();
    $('.open').show();
    E.stopPropagation();
  });
  $('body').click(function(){
    $('.open').hide();
    $('.close').show();
  });

    tumblrTile.draw();
});
