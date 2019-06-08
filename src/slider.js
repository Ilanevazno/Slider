import { get } from "http";
import { offset } from "highcharts";

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

        let shiftX = e.pageX - (toggler.get(0).getBoundingClientRect().left + window.pageXOffset);
        let sliderCoords = slider.get(0).getBoundingClientRect().left + window.pageXOffset;
        
        function moveAt(e){
            let newLeft = e.pageX - shiftX - sliderCoords;

            if (newLeft < 0) {
                newLeft = 0;
            }

            let rightEdge = slider.width() - toggler.width();

            if (newLeft > rightEdge) {
                newLeft = rightEdge;
            }
            
            toggler.css({
                "left": newLeft + "px",
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