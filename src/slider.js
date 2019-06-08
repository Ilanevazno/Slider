import { get } from "http";

$(document).ready(function(e){
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
            let sliderCoords = slider.get(0).getBoundingClientRect().left;
            let shiftX = e.pageX - toggler.get(0).getBoundingClientRect().left
            let newLeft = e.pageX - sliderCoords;

            console.log(Math.round(newLeft));
            
            toggler.css({
                "left": newLeft + "px",
            })
        }

        $('body').on('mousemove', function(e){
            moveAt(e);
            getCoords();
        });

        $('body').on('mouseup', function(e){
            $('body').off("mousemove");
        })

        function getCoords(elem){

        }
    })

    toggler.ondragstart = function() {
        return false;
      };
})