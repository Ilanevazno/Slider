export class Controller{
    observer: any
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
    sliderExemplar: any;
    private activeDirection: string;

    public enableLogs (state: boolean) {
        this.model.enableLogs(state);
    }

    public setViewType (viewType: string): void {
        this.view.viewType = viewType;
        this.view.viewType === 'horizontal' ? this.activeDirection = 'left' : this.activeDirection = 'top'
    }

    public getValueIndicator (data) {
        this.view.getValueIndicator(data);
    }

    public setSliderType (sliderType: string): void {
        this.view.renderPointer(this.model.getPointerCount(sliderType));

        this.sliderType = sliderType;
        this.AccessToDragging();
    }

    public generateSlider(exemplar: JQuery<HTMLElement>): void{
        this.sliderExemplar = exemplar;
        this.view.sliderStart(exemplar);
    }

    public AccessToDragging(): void {
        this.slider = this.model.getSliderData(this.view.viewType);
        this.pointerValues = this.model.initState(this.view.viewType, this.slider);

        if (this.sliderType === 'doubleValue') {
            // здесь берём самый первый pointer как минимальное значение, и последний - как максимальное
            this.minValue = this.pointerValues[0];
            this.maxValue = this.pointerValues[Object.keys(this.pointerValues).length - 1];
        }

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
            this.pointerValues = this.model.getState();
            this.pointerPosition = this.model.getPointerPosition(this.view.viewType, shift, e);
            this.setStepSettings(this.stepSize);
        }
    }
    
    public setStepSettings(stepSize: number){
        let cursorPosition = this.model.getValuePercent(this.slider, this.pointerPosition);

        let stepMove = this.model.checkStepSettings(cursorPosition);

        if(stepMove){
            this.pointerPosition = this.model.checkSliderArea(this.pointerPosition, this.slider);
            this.model.setState(this.targetedPointer, this.model.getValuePercent(this.slider, this.pointerPosition));
            this.movePointerTo(this.pointerPosition);

            // this.view.setValueSetting.val(this.activePercent);
        }
    }

    private move (direction: string, eq: number, expression: any) {
        direction === "left" ? 
        this.model.getNthPointer(eq).css({
            "left": `${expression}px`
        }) 
        :
        this.model.getNthPointer(eq).css({
            "top": `${expression}px`
        }) 
    }

    private checkCollision (direction) {
        if (this.model.checkCollision(this.pointerValues)) {
            this.targetedPointer === this.model.getNthPointer(0)[0] ?
                this.move(direction, 1, this.model.PercentToPx(this.slider, this.minValue.pointerValue))
                :
                this.move(direction, 0, this.model.PercentToPx(this.slider, this.maxValue.pointerValue))
        }
    }

    public movePointerTo(position: number){
        const offset: number = this.model.getNthPointer(0)[0].offsetWidth;

        if (this.view.viewType === 'horizontal') {
            this.checkCollision(this.activeDirection);

            $(this.targetedPointer).css({
                "left": `${position}px`,
            })
        } else if (this.view.viewType === 'vertical') {
            this.checkCollision(this.activeDirection);

            $(this.targetedPointer).css({
                "top": `${position}px`,
            })
        }
    };

    public StopPointerMove(): void {
        $(document).off("mousemove");
    }

    public initSettings(exemplar: any): void{   
        const controller = this;
        const panel = this.view.getSettingsPanel(exemplar);

        const stepSizeInput = {
            mounted (stepSize) {
                controller.model.setStepSize(stepSize)
            },
            text: 'шаг'
        }

        const showValueCheckbox: object = {
            mounted () {
                controller.getValueIndicator(controller.pointerValues)
            }, 
            destroy () {
                controller.view.removeValueIndicator();
            },
            text: 'Показывать значение'
        };

        const horizontalViewCheckbox = {
            mounted () {
                controller.setViewType('horizontal');
                controller.view.sliderStart(controller.sliderExemplar);
                controller.setSliderType(controller.sliderType);
            },
            destroy () {
                controller.view.destroySlider(controller.sliderExemplar);
            },
            text: 'Горизонтальный вид'
        };

        const verticalViewCheckbox = {
            mounted () {
                controller.setViewType('vertical');
                controller.view.sliderStart(controller.sliderExemplar);
                controller.setSliderType(controller.sliderType);
            },
            destroy () {
                controller.view.destroySlider(controller.sliderExemplar);
            },
            text: 'Вертикальный вид'
        }

        const singleValueCheckbox = {
            mounted () {

            },

            destroy () {

            },
            text: 'одиночное значение'
        }

        const doubleValueCheckbox = {
            mounted () {

            },

            destroy () {

            },
            text: 'интервал'
        }

        // для каждого pointer'a создаём отдельный инпут

        let inputValues: any = [];
        let checkValidData = (value: any, state) => {
            if (value < controller.model.valueFrom || value > controller.model.valueTo) {
                return  false;
            } else {
                return true;
            }
        }

        for (let i = 0; i < controller.pointerValues.length; i++) {
            let activeState = controller.model.getState();
            const inputList = {
                mounted (value) {
                    try {
                        if (checkValidData(Number(value), activeState)) {
                            controller.model.setState(controller.model.getNthPointer(i)[0], value);
                            controller.targetedPointer = controller.model.getNthPointer(i)[0];
                            controller.movePointerTo(controller.model.PercentToPx(controller.slider, Number(value)));
                        }
                    } catch (err) {
                        alert('Не удалось установить значение');
                        console.log('не удалось установить значение по причине: \n', err);
                    }
                },
                destroy () {
    
                },
                text: controller.pointerValues[i].pointerValue
            }
            let input = panel.getInput(inputList);
            inputValues.push(input.input);
        }

        controller.model.observer.subscribe(data => {
            for (let i = 0; i < data.somedata.length; i++) {
                inputValues[i].val(data.somedata[i].pointerValue);
            }
        })

        const stepSize = panel.getInput(stepSizeInput);
        const showValue = panel.getCheckBox(showValueCheckbox);
        const horizontalView = panel.getCheckBox(horizontalViewCheckbox);
        const verticalView = panel.getCheckBox(verticalViewCheckbox);
        const singleValue = panel.getCheckBox(singleValueCheckbox);
        const doubleValue = panel.getCheckBox(doubleValueCheckbox);

        const defaultViewType = () => {
            switch (controller.view.viewType) {
                case 'horizontal':
                    horizontalView.checkbox.prop('checked', true)
                    break
                case 'vertical':
                    verticalView.checkbox.prop('checked', true)
                    break
            }
        }

        // select default view type checkbox
        defaultViewType();

        const uncheck = (checkBoxList: any) => {
            checkBoxList.map((itm) => itm.checkbox.prop('checked', false));
        }

        horizontalView.checkbox.on('change', () => {
            if (verticalView.checkbox.is(':checked')) {
                uncheck([verticalView, showValue]);
            }
        })

        verticalView.checkbox.on('change', () => {
            if (horizontalView.checkbox.is(':checked')) {
                uncheck([showValue, horizontalView]);
            }
        })
    }
}
