import { SettingsPanel } from '../components/panel'
export class Controller{
    observer: any
    model: any;
    view: any;
    panel: any;
    constructor (model, view, observer) {
        this.model = model;
        this.view = view;
        this.observer = observer;
    }
    public sliderParams: number;
    public pointerPosition: number;
    private stepSize: number;
    public targetedPointer: any;
    private minValue: any;
    private maxValue: any;
    public sliderType: string;
    public sliderExemplar: any;
    private activeDirection: string;

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
        this.model.state = this.model.initState({
            sliderViewType: this.view.viewType,
            sliderWidth: this.sliderParams,
            pointerList: this.view.pointerList
        });
    }

    private renderTrackLine () {
        this.model.observer.subscribe(data => {
            for (let i = 0; i < this.model.state.length; i++) {
                switch (this.sliderType) {
                    case 'singleValue':
                        if (this.view.viewType === 'horizontal') {
                            this.view.trackLine.width(`${this.model.state[this.model.state.length - 1].pointerValue + 1}%`);
                        } else if (this.view.viewType === 'vertical') {
                            this.view.trackLine.width('100%');
                            this.view.trackLine.height(`${this.model.state[this.model.state.length - 1].pointerValue + 1}%`);
                        }
                        
                        break
                    case 'doubleValue':
                        if (this.view.viewType === 'horizontal') {
                            this.view.trackLine.width(`${(this.maxValue.pointerValue - this.minValue.pointerValue) + 1}%`);
                            $(this.view.trackLine).css({ 'left': `${this.minValue.pointerValue}%` })
                        } else if (this.view.viewType === 'vertical') {
                            this.view.trackLine.width('100%');
                            $(this.view.trackLine).css({ 'top': `${this.minValue.pointerValue}%` })
                            this.view.trackLine.height(`${(this.maxValue.pointerValue - this.minValue.pointerValue) + 1}%`);
                        }

                        break
                    default: 
                        alert('Ошибка в TrackLine');
                        console.log('Ошибка в методе renderTrackLine');
                }
            }
        })
    }

    public AccessToDragging(): void {
        this.initState();
        this.renderTrackLine();

        // if sliderType == double, then we getting 2 variables with min and max values 
        if (this.sliderType === 'doubleValue') {
            this.minValue = this.model.state[0];
            this.maxValue = this.model.state[Object.keys(this.model.state).length - 1];
        }

        for(let i = 0; i < this.model.state.length; i++) {
            let element = this.model.state[i].pointerItem;
            $(element).on('mousedown', function(e: any) {
                e.preventDefault();

                this.targetedPointer = e.currentTarget;

                let shiftDirection = this.model.getShiftВirection(this.view.viewType, e, element);
                this.prepareForUsing(this.targetedPointer, shiftDirection);
            }.bind(this));
        }

        this.model.observer.subscribe(data => {
            for (let i = 0; i < data.length; i++) {
                this.moveCurrentPointer(this.activeDirection, i, this.model.PercentToPx(this.sliderParams, this.model.state[i].pointerValue));
            }
        })
    }

    public prepareForUsing(targetedPointer: any, shift: number): void {
        $(document).on("mousemove", this.StartPointerMove(shift, targetedPointer).bind(this));
        $(document).on("mouseup", this.StopPointerMove.bind(this));
    }

    public StartPointerMove(shift: number, targetedPointer: object) {
        return (e: any) => {
            this.model.state = this.model.getState();
            this.pointerPosition = this.model.getPointerPosition(this.view.sliderBodyHtml[0], this.view.viewType, shift, e);
            this.checkStep();
        }
    }
    
    private checkStep(){
        let cursorPosition = this.model.getValuePercent(this.sliderParams, this.pointerPosition);
        const getBreakPoints = () => {
            const result = [];
            let from = Number(this.model.valueFrom);
            
            while(from <= this.model.valueTo) {
                result.push(Math.floor(from));
                from = from + Number(this.model.pointerStepSize);

            }
            return result;
        }

        getBreakPoints().map(breakpoint => {
            if (cursorPosition === breakpoint) {
                this.pointerPosition = this.model.checkSliderArea(this.pointerPosition, this.sliderParams);
                this.model.setState(this.targetedPointer, this.model.getValuePercent(this.sliderParams, this.pointerPosition));
                this.moveTargetPointer(this.pointerPosition);
            }
        })
    }

    public moveCurrentPointer (direction: string, eq: number, expression: any) {
        direction === "left" ? 
        $(this.model.getNthPointer(eq)).css({
            "left": `${expression}px`
        }) 
        :
        $(this.model.getNthPointer(eq)).css({
            "top": `${expression}px`
        }) 
    }

    private checkCollision (direction) {
        if (this.model.checkCollision(this.model.state)) {
            if(this.targetedPointer === this.model.getNthPointer(0)[0]) {}
            this.targetedPointer === this.model.getNthPointer(0)[0] ?
                this.moveCurrentPointer(direction, this.model.state.length - 1, this.model.PercentToPx(this.sliderParams, this.minValue.pointerValue))
                :
                this.moveCurrentPointer(direction, 0, this.model.PercentToPx(this.sliderParams, this.maxValue.pointerValue))
        }
    }

    public moveTargetPointer(position: number){
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
        } else {
            console.log('не удалось изменить положение pointer')
        }
    };

    public StopPointerMove(): void {
        $(document).off("mousemove");
    }

    public initSettings (activity: boolean) {
        this.panel = new SettingsPanel.Panel;
        this.panel.renderSettingsPanel(this.sliderExemplar);
        const that = this;

        const refreshSlider = () => {
            this.view.destroySlider();
            this.view.renderSlider(this.sliderExemplar);
            this.view.renderPointer(this.model.getPointerCount(this.sliderType));
            this.AccessToDragging();
        }

        const uncheck = (checkBoxList: any) => {
            checkBoxList.map((itm) => itm.children().prop('checked', false));
        }

        const getStateInputs = () => {
            const inputState = [];
            for (let i = 0; i < this.model.state.length; i++) {
                let InputObj = {
                    mounted () {
                        that.model.setState(that.model.state[i].pointerItem, gettedInput.input.val());

                        that.model.observer.subscribe(data => {
                            for (let i = 0; i < that.model.state.length; i++) {
                                that.moveCurrentPointer(that.activeDirection, i, that.model.PercentToPx(that.sliderParams, that.model.state[i].pointerValue));
                            }
                        })
                    },
        
                    destroy () {
        
                    },
    
                    text: this.model.state[i].pointerValue
                }
    
                let gettedInput = this.panel.getInput(InputObj);
                inputState.push(gettedInput.input);
            }
            return inputState;
        }

        let stateInputList: any = [];

        const singleValueCheckBox = {
            mounted () {
                uncheck([getValue]);
                stateInputList.map(input => {
                    $(input).remove();
                })

                stateInputList = [];

                that.setSliderType('singleValue');
                refreshSlider();
                const stateInputs = getStateInputs();

                stateInputs.map(item => {
                    stateInputList.push(item);
                })

                that.model.observer.subscribe(data => {
                    for(let i = 0; i < that.model.state.length; i++) {
                        that.panel.settingsPanel.find(stateInputs[0]).val(that.model.state[0].pointerValue);
                    }
                })
            },

            destroy () {
                //do something
            },

            text: 'одиночное значение'
        }

        const doubleValueCheckBox = {
            inputList: [],
            mounted () {
                uncheck([getValue]);
                stateInputList.map(input => {
                    $(input).remove();
                })

                stateInputList = [];

                that.setSliderType('doubleValue');
                refreshSlider();
                let stateInputs = getStateInputs();

                stateInputs.map(item => {
                    stateInputList.push(item);
                })

                that.model.observer.subscribe(data => {
                    for(let i = 0; i < that.model.state.length; i++) {
                        that.panel.settingsPanel.find(stateInputs[i]).val(that.model.state[i].pointerValue);
                    }
                })
            },

            destroy () {
                //do something
            },

            text: 'интервал'
        }

        const showValueCheckbox: object = {
            mounted () {
                that.getValueIndicator(that.model.state)
            }, 
            destroy () {
                that.view.removeValueIndicator();
            },
            text: 'Показывать значение'
        };

        const horizontalViewCheckbox = {
            mounted () {
                uncheck([getValue]);
                that.setViewType('horizontal');
                refreshSlider();
                that.setSliderType(that.sliderType);
            },
            destroy () {
                that.view.destroySlider();
            },
            text: 'Горизонтальный вид'
        };

        const verticalViewCheckbox = {
            mounted () {
                uncheck([getValue]);
                that.setViewType('vertical');
                refreshSlider();
                that.setSliderType(that.sliderType);
            },
            destroy () {
                that.view.destroySlider();
            },
            text: 'Вертикальный вид'
        }

        const stepSizeInput = {
            mounted (stepSize) {
                that.model.setStepSize(stepSize)
        },

        text: 'шаг'
        }

        const stepSize = this.panel.getInput(stepSizeInput);
        const getValue = this.panel.getCheckBox(showValueCheckbox);
        const singleValue = this.panel.getRadio(singleValueCheckBox, 'valueType');
        const doubleValue = this.panel.getRadio(doubleValueCheckBox, 'valueType');
        const horizontalView = this.panel.getRadio(horizontalViewCheckbox, 'viewType');
        const verticalView = this.panel.getRadio(verticalViewCheckbox, 'viewType');
    }
}
