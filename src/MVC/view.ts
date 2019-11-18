import { Model } from './model';

export class View{
    viewType: string;
    slider: JQuery<HTMLElement>;
    sliderBody: any;
    sliderPointer: any;
    valueIndicator: any;
    model: any = new Model;
    settingsPanel: JQuery<HTMLElement>;
    stepSizeSetting: any;
    setValueSetting: JQuery<HTMLElement>;
    enablePointerLabel: JQuery<HTMLElement>;
    enablePointerButton: JQuery<HTMLElement>;
    sliderTypeForm: JQuery<HTMLElement>;
    horizonViewLabel: JQuery<HTMLElement>;
    horizontViewButton: JQuery<HTMLElement>;
    verticalViewLabel: JQuery<HTMLElement>;
    verticalViewButton: JQuery<HTMLElement>;
    valueTypeForm: JQuery<HTMLElement>;
    singleValueLabel: JQuery<HTMLElement>;
    singleValueButton: JQuery<HTMLElement>;
    intervalLabel: JQuery<HTMLElement>;
    intervalButton: JQuery<HTMLElement>;
    applySettingsBtn: JQuery<HTMLElement>;
    sliderValueType: number = 2;

    private renderPointer (count: any) {
        for(let i = 0; i < count; i++) {
            this.sliderPointer = $('<span/>', {
                class: "slider__pointer"
            }).appendTo(this.sliderBody);
        }
    }

    public sliderStart(exemplar: any): void{

        // this.model.subscribe((data: any) => { console.log("view test", data) });

        // this.model.broadcast({somedata: "hello"});

        if (this.viewType === 'horizontal') {
            this.sliderBody = $('<div/>', {
                class: 'slider__body-horizontal'
            }).appendTo(exemplar);
    
            this.renderPointer(this.sliderValueType);
            this.viewType = 'horizontal'
        } else if (this.viewType === 'vertical') {
            this.sliderBody = $('<div/>', {
                class: 'slider__body-vertical'
            }).appendTo(exemplar);
    
            this.renderPointer(this.sliderValueType);

            this.viewType = 'vertical'
        }
        this.model.pointerCoords = this.model.getCoords(this.sliderPointer);
    }

    public getValueIndicator(): void {
        this.valueIndicator = $('<span/>', {
            class: "slider__value",
            text: "0"
        }).appendTo(this.sliderPointer);
    }   

    public renderSettingsPanel(exemplar: JQuery<HTMLElement>): void{
        this.settingsPanel = $('<div/>', {
            class: "slider_settings"
        }).appendTo(exemplar);

        this.stepSizeSetting = $('<input/>', {
            type: "value",
            class: "step_size",
            placeholder: "Размер шага:"
        }).appendTo(this.settingsPanel);

        this.setValueSetting = $('<input/>', {
            type: "value",
            class: "setup_value",
            placeholder: "Установить значение"
        }).appendTo(this.settingsPanel);

        this.enablePointerLabel = $('<label/>', {
            for: "Enable_actValue",
            text: "Показыавть бегунок:"
        }).appendTo(this.settingsPanel);

        this.enablePointerButton = $('<input/>', {
            type: "checkbox",
            id: "Enable_actValue"
        }).appendTo(this.enablePointerLabel);

        this.sliderTypeForm = $('<form/>', {
            id: "view_type",
            class: "view_type",
            text: "Тип слайдера:"
        }).appendTo(this.settingsPanel);

        this.horizonViewLabel = $('<label/>', {
            for: "Horizontal_view",
            text: "Горизонтальный вид"
        }).appendTo(this.settingsPanel);

        this.horizontViewButton = $('<input/>', {
            type: "checkbox",
            id: "Horizontal_view",
        }).appendTo(this.horizonViewLabel);

        this.verticalViewLabel = $('<label/>', {
            for: "Vertical_view",
            text: "Вертикальный вид"
        }).appendTo(this.settingsPanel);

        this.verticalViewButton = $('<input/>', {
            type: "checkbox",
            id: "Vertical_view",
        }).appendTo(this.verticalViewLabel);

        this.valueTypeForm = $('<form/>', {
            class: "value_type",
            id: "value_type",
            text: "Тип значения:"
        }).appendTo(this.settingsPanel);

        this.singleValueLabel = $('<label/>', {
            for: "single_value",
            text: "Одиночное значение",
        }).appendTo(this.settingsPanel);
        
        this.singleValueButton = $('<input/>', {
            id: "single_value",
            type: "checkbox",
        }).appendTo(this.singleValueLabel);

        this.intervalLabel = $('<label/>', {
            for: "interval_value",
            text: "Интервал"
        }).appendTo(this.settingsPanel);

        this.intervalButton = $('<input/>', {
            type: "checkbox",
            id: "interval_value"
        }).appendTo(this.intervalLabel);

        this.applySettingsBtn = $('<button/>', {
            class: "apply_values",
            type: "submit",
            text: "Применить значения"
        }).appendTo(this.settingsPanel);
    }

    public setPointerIndicatorValue(percent: any){
        try {
            this.valueIndicator.text(percent);
        } catch (err) {
            // console.log("Не могу включить индикатор по причине: ", err);
        }
    }

    public setValueSettingCorrect(success: any){
        if (success) {
            this.setValueSetting.css({
                "outline": "none",
            })
        } else {
            this.setValueSetting.css({
                "outline": "2px solid red",
            })
        }
    }
}