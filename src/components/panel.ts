export namespace SettingsPanel {
    export class Panel {
        settingsPanel: JQuery<HTMLElement>;

        public getInput (fn, placeholder) {
            let input = $('<input/>', {
                placeholder: placeholder
            }).appendTo(this.settingsPanel)
            .on('input', () => {
                fn(input.val());
            });
        }

        public getCheckBox (fn, connectTo) {
            connectTo.on('checked', () => {
                console.log('checked!');
            })
        }

        public renderSettingsPanel(exemplar: JQuery<HTMLElement>): void{
            this.settingsPanel = $('<div/>', {
                class: "slider_settings"
            }).appendTo(exemplar);
        }

        public setValueSettingCorrect(success: any){
            // if (success) {
            //     this.setValueSetting.css({
            //         "outline": "none",
            //     })
            // } else {
            //     this.setValueSetting.css({
            //         "outline": "2px solid red",
            //     })
            // }
        }
    }
}