export class Controller{
    observer: void
    model: any;
    view: any;
    constructor (model, view, observer) {
        this.model = model;
        this.view = view;
        this.observer = observer;
    }
    private activePercent: number = 0;
    private slider: number;
    private pointerPosition: number;
    private stepSize: number;
    private targetedPointer: any;
    public pointerValues: any;
    minValue: any;
    maxValue: any;
    sliderType: string;
    firstPointerClass: string = 'first_value';
    secondPointerClass: string = 'second_value';

    public enableLogs (state: boolean) {
        this.model.enableLogs(state);
    }

    public setViewType (viewType: string): void {
        this.view.viewType = viewType;
    }

    public setSliderType (sliderType: string): void {
        this.view.renderPointer(this.model.getPointerCount(sliderType));

        this.sliderType = sliderType;
    }

    public generateSlider(exemplar: JQuery<HTMLElement>): void{
        this.model.devLog("Генерирую слайдер");
        this.view.sliderStart(exemplar);
    }

    public AccessToDragging(): void {
        for(let i = 0; i < this.view.sliderBody[0].childNodes.length; i++) {
            let element = this.view.sliderBody[0].childNodes[i];
            $(element).on('mousedown', function(e: any) {
                e.preventDefault();

                this.targetedPointer = e.currentTarget;

                let shiftDirection = this.model.getShiftВirection(this.view.viewType, e, element);
                this.prepareForUsing(this.targetedPointer, shiftDirection);
            }.bind(this));
        }
    }

    public prepareForUsing(targetedPointer: any, shift: number): void {
        $(document).on("mousemove", this.StartPointerMove(shift, targetedPointer).bind(this));
        $(document).on("mouseup", this.StopPointerMove.bind(this));
    }

    public StartPointerMove(shift: number, targetedPointer: object) {
        return (e: any) => {
            this.model.devLog("Старт движения ползунка, получаю ширину слайдера и координаты ползунка");

            // записываем активные значения первого и второго бегунка

            this.pointerValues = this.model.getPointerValues('doubleValue', this.slider);
            this.pointerPosition = this.model.getPointerPosition(this.view.viewType, shift, e);
            this.slider = this.model.getSliderData(this.view.viewType);
            this.model.changePointerState(this.slider);

            if (this.sliderType === 'doubleValue') {
                // здесь берём самый первый pointer как минимальное значение, и последний - как минимальное
                this.minValue = this.pointerValues[0];
                this.maxValue = this.pointerValues[Object.keys(this.pointerValues).length - 1];
            }

            // console.log(this.pointerValues);

            // for (let i = 0; i <= Object.keys(this.pointerValues).length; i++) {
            //     this.view.generateInput(this.firstPointerClass, 'Значение первого ползунка');
            // }
            
            // Object.keys(this.pointerValues.pointerValue).forEach(element => {
            //     console.log(element);
            // });

            this.model.devLog("Устанавливаю шаг");
            this.setStepSettings(this.stepSize);
        }
    }
    
    public setStepSettings(stepSize: number){
        this.model.getPointerState();
        this.model.devLog(`Шаг установлен на ${stepSize}`);
        let cursorPosition = this.model.getValuePercent(this.slider, this.pointerPosition);

        let stepMove = this.model.checkStepSettings(cursorPosition);

        if(stepMove){
            this.pointerPosition = this.model.checkSliderArea(this.pointerPosition, this.slider);
            this.model.devLog(`Позиция ползунка установлена на ${(this.model.getValuePercent(this.slider, this.pointerPosition))}`);
            
            this.movePointerTo(this.pointerPosition);

            // this.view.setValueSetting.val(this.activePercent);
        }
    }

    public movePointerTo(position: number){
        let offset: number = this.model.getNthPointer(0)[0].offsetWidth;

        let move = (eq: number, expression: any) => {
            this.model.getNthPointer(eq).css({
                "left": `${expression}px`
            })
        }

        if (this.view.viewType === 'horizontal') {
            if (!this.model.checkCollision(this.pointerValues)) {
                this.targetedPointer === this.model.getNthPointer(0)[0] ?
                    move(1, this.model.PercentToPx(this.slider, this.minValue.pointerValue))
                    :
                    move(0, this.model.PercentToPx(this.slider, this.maxValue.pointerValue))
            }

            $(this.targetedPointer).css({
                "left": `${position}px`,
            })
        } else if (this.view.viewType === 'vertical') {
            this.view.sliderPointer.css({
                "top": `${position}px`,
            })
        }
    };

    public StopPointerMove(): void {
        $(document).off("mousemove");
    }

    public initSettings(exemplar: any): void{
        const panel = this.view.getSettingsPanel(exemplar);
        const stepSize = panel.getInput(this.model.setStepSize.bind(this.model), panel.stepSizeSetting);
        this.view.getValueIndicator();
        // const showValues = panel.connectCheckBox();
    }
}
