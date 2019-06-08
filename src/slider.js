$(document).ready(function(){
    let slider = $('.slider');
    let toggler = slider.children(0);
    
    toggler.on('mousedown', function(e) {
        toggler.css({
            "position": "absolute",
            "z-index": "1000",
        })
        moveAt(e);
        slider.append(toggler);    
        function moveAt(e){
            toggler.css({
                "left": e.pageX - toggler.outerWidth() / 2 + "px",
            })
        }

        $('body').on('mousemove', function(e){
            moveAt(e);
        });

        $('body').on('mouseup', function(e){
            $('body').off("mousemove");
        })
    })

    toggler.ondragstart = function() {
        return false;
      };
})