export namespace SettingsPanel {
    export class Panel {
        settingsPanel: JQuery<HTMLElement>;

        public getInput (obj) {
            const input = $('<input/>', {
                placeholder: obj.text
            }).appendTo(this.settingsPanel)
            .on('input', () => {
                obj.mounted(input.val());
            });
        }

        public getCheckBox (obj) {
            const labelForCheckbox = $('<label/>', {
                type: 'checkbox',
                text: obj.text
            }).appendTo(this.settingsPanel)
            const checkBox: any = $('<input/>', {
                type: 'checkbox'
            }).appendTo(labelForCheckbox)
            .on('change', () => {
                checkBox.is(':checked') ? obj.mounted() : obj.destroy();
            });
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