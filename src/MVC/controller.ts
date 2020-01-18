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
        this.state = this.model.initState({
            sliderViewType: this.view.viewType,
            sliderWidth: this.sliderParams,
            pointerList: this.view.pointerList
        });
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

        this.model.observer.subscribe(data => {
            for (let i = 0; i < data.length; i++) {
                console.log('asd');
                this.move(this.activeDirection, i, this.model.PercentToPx(this.sliderParams, this.state[i].pointerValue));
            }
        })
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
        $(this.model.getNthPointer(eq)).css({
            "left": `${expression}px`
        }) 
        :
        $(this.model.getNthPointer(eq)).css({
            "top": `${expression}px`
        }) 
    }

    private checkCollision (direction) {
        if (this.model.checkCollision(this.state)) {
            if(this.targetedPointer === this.model.getNthPointer(0)[0]) {}
            this.targetedPointer === this.model.getNthPointer(0)[0] ?
                this.move(direction, this.state.length - 1, this.model.PercentToPx(this.sliderParams, this.minValue.pointerValue))
                :
                this.move(direction, 0, this.model.PercentToPx(this.sliderParams, this.maxValue.pointerValue))
        }
    }

    public movePointerTo(position: number){
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

        const getStateInputs = () => {
            const inputState = [];
            for (let i = 0; i < this.model.state.length; i++) {
                let InputObj = {
                    mounted () {
                        that.model.setState(that.state[i].pointerItem, gettedInput.input.val());

                        that.model.observer.subscribe(data => {
                            for (let i = 0; i < that.state.length; i++) {
                                that.move(that.activeDirection, i, that.model.PercentToPx(that.sliderParams, that.state[i].pointerValue));
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

        const singleValueCheckBox = {
            inputs: [],
            mounted () {
                that.setSliderType('singleValue');
                refreshSlider();
                const stateInputs = getStateInputs();

                this.inputs.push(stateInputs);

                that.model.observer.subscribe(data => {
                    for(let i = 0; i < that.state.length; i++) {
                        that.panel.settingsPanel.find(stateInputs[0]).val(that.state[0].pointerValue);
                    }
                })
            },

            text: 'одиночное значение'
        }

        const doubleValueCheckBox = {
            inputs: [],
            mounted () {
                this.inputs.map(item => {
                    item.remove();
                });

                that.setSliderType('doubleValue');
                refreshSlider();
                const stateInputs = getStateInputs();
                

                stateInputs.map(input => {
                    this.inputs.push(input);
                })

                that.model.observer.subscribe(data => {
                    for(let i = 0; i < that.state.length; i++) {
                        that.panel.settingsPanel.find(stateInputs[i]).val(that.state[i].pointerValue);
                    }
                })
            },

            destroy () {
                console.log('destroyed')
            },

            text: 'интервал'
        }

        const showValueCheckbox: object = {
            mounted () {
                that.getValueIndicator(that.state)
            }, 
            destroy () {
                that.view.removeValueIndicator();
            },
            text: 'Показывать значение'
        };

        const horizontalViewCheckbox = {
            mounted () {
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
