export class Controller{
    observer: any
    model: any;
    view: any;
    constructor (model, view, observer) {
        this.model = model;
        this.view = view;
        this.observer = observer;
    }
    private sliderParams: number;
    private pointerPosition: number;
    private stepSize: number;
    private targetedPointer: any;
    public state: any;
    private minValue: any;
    private maxValue: any;
    private sliderType: string;
    private sliderExemplar: any;
    private activeDirection: string;
    private settings: boolean = false;

    public setStepSize (size: number) {
        this.model.pointerStepSize = size;
    }

    public setViewType (viewType: string): void {
        this.view.viewType = viewType;
        this.view.viewType === 'horizontal' ? this.activeDirection = 'left' : this.activeDirection = 'top'
    }

    public getValueIndicator (data) {
        if (data === false) {
            return null
        }
        this.view.getValueIndicator(data);
    }

    public setSliderType (sliderType: string): void {
        this.sliderType = sliderType;
    }

    public generateSlider(exemplar: JQuery<HTMLElement>): void{
        this.sliderExemplar = exemplar;
        this.view.renderSlider(exemplar);
        this.view.renderPointer(this.model.getPointerCount(this.sliderType));
        this.AccessToDragging();
    }

    private initState () {
        this.sliderParams = this.model.getSliderParams(this.view.sliderBodyHtml, this.view.viewType);
        this.state = this.model.initState(this.view.viewType, this.sliderParams);
    }

    public AccessToDragging(): void {
        this.initState();
        // if sliderType == double, then we getting 2 variables with min and max values 
        if (this.sliderType === 'doubleValue') {
            this.minValue = this.state[0];
            this.maxValue = this.state[Object.keys(this.state).length - 1];
        }

        for(let i = 0; i < this.state.length; i++) {
            let element = this.state[i].pointerItem;
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
            this.state = this.model.getState();
            this.pointerPosition = this.model.getPointerPosition(this.view.viewType, shift, e);
            this.checkStep(this.stepSize);
        }
    }
    
    private checkStep(stepSize: number){
        let cursorPosition = this.model.getValuePercent(this.sliderParams, this.pointerPosition);

        let stepMove = this.model.checkStepSettings(cursorPosition);

        if(stepMove){
            this.pointerPosition = this.model.checkSliderArea(this.pointerPosition, this.sliderParams);
            this.model.setState(this.targetedPointer, this.model.getValuePercent(this.sliderParams, this.pointerPosition));
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
        if (this.model.checkCollision(this.state)) {
            this.targetedPointer === this.model.getNthPointer(0)[0] ?
                this.move(direction, 1, this.model.PercentToPx(this.sliderParams, this.minValue.pointerValue))
                :
                this.move(direction, 0, this.model.PercentToPx(this.sliderParams, this.maxValue.pointerValue))
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

    public initSettings(settingsEnabled: boolean, exemplar: any): void{   
        if (settingsEnabled === false) {
            return null
        }
        const controller = this;
        const panel = this.view.getSettingsPanel(exemplar);
        let inputValues: any = [];

        const refreshSlider = () => {
            controller.view.destroySlider();
            controller.view.renderSlider(controller.sliderExemplar);
            controller.view.renderPointer(controller.model.getPointerCount(controller.sliderType));
            controller.AccessToDragging();
        }

        const stepSizeInput = {
            mounted (stepSize) {
                controller.model.setStepSize(stepSize)
            },
            text: 'шаг'
        }

        const showValueCheckbox: object = {
            mounted () {
                controller.getValueIndicator(controller.state)
            }, 
            destroy () {
                controller.view.removeValueIndicator();
            },
            text: 'Показывать значение'
        };

        const horizontalViewCheckbox = {
            mounted () {
                controller.setViewType('horizontal');
                refreshSlider();
                controller.setSliderType(controller.sliderType);
            },
            destroy () {
                controller.view.destroySlider();
            },
            text: 'Горизонтальный вид'
        };

        const verticalViewCheckbox = {
            mounted () {
                controller.setViewType('vertical');
                refreshSlider();
                controller.setSliderType(controller.sliderType);
            },
            destroy () {
                controller.view.destroySlider();
            },
            text: 'Вертикальный вид'
        }

        const getStateInputs = (i) => {
            let activeState = controller.model.getState();
            const inputList = {
                mounted (value) {
                    try {
                        if (checkValidData(Number(value), activeState)) {
                            controller.model.setState(controller.model.getNthPointer(i)[0], value);
                            controller.targetedPointer = controller.model.getNthPointer(i)[0];
                            controller.movePointerTo(controller.model.PercentToPx(controller.sliderParams, Number(value)));
                        }
                    } catch (err) {
                        alert('Не удалось установить значение');
                        console.log('не удалось установить значение по причине: \n', err);
                    }
                },
                destroy () {
    
                },
                text: controller.state[i].pointerValue
            }
            let input = panel.getInput(inputList);
            inputValues.push(input.input);
        }

        const singleValueCheckbox = {
            mounted () {
                panel.destroyInput(inputValues);
                controller.setSliderType('singleValue');
                refreshSlider();

                for (let i = 0; i < controller.state.length; i++) {
                    getStateInputs(i);
                }

                controller.model.observer.subscribe(data => {
                    for (let i = 0; i < data.somedata.length; i++) {
                        inputValues[i].val(data.somedata[i].pointerValue);
                    }
                })
            },

            destroy () {
                controller.view.pointer.destroyPointers();
                panel.destroyInput(inputValues);
                inputValues = [];
                controller.model.observer.unsubscribe(data => {
                    for (let i = 0; i < data.somedata.length; i++) {
                        inputValues[i].val(data.somedata[i].pointerValue);
                    }
                });
            },
            text: 'одиночное значение'
        }

        const doubleValueCheckbox = {
            mounted () {
                panel.destroyInput(inputValues);
                controller.setSliderType('doubleValue');
                refreshSlider();
                for (let i = 0; i < controller.state.length; i++) {
                    getStateInputs(i);
                }

                controller.model.observer.subscribe(data => {
                    for (let i = 0; i < data.somedata.length; i++) {
                        inputValues[i].val(data.somedata[i].pointerValue);
                    }
                })
            },

            destroy () {
                controller.view.pointer.destroyPointers();
                panel.destroyInput(inputValues);
                inputValues = [];
                controller.model.observer.unsubscribe(data => {
                    for (let i = 0; i < data.somedata.length; i++) {
                        inputValues[i].val(data.somedata[i].pointerValue);
                    }
                });
            },
            text: 'интервал'
        }

        let checkValidData = (value: any, state) => {
            if (value < controller.model.valueFrom || value > controller.model.valueTo) {
                return  false;
            } else {
                return true;
            }
        }

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

        singleValue.checkbox.on('change', () => {
            if (doubleValue.checkbox.is(':checked')) {
                uncheck([showValue, doubleValue]);
            }
        })

        doubleValue.checkbox.on('change', () => {
            if (singleValue.checkbox.is(':checked')) {
                uncheck([showValue, singleValue]);
            }
        })

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
