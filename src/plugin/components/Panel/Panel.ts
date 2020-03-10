export namespace SettingsPanel {
  export class Panel {
    settingsPanel!: JQuery<HTMLElement>;

    that: any = this;

    inputList: any = {
      inputs: [],

      removeItem(item) {
        item.remove();
        const idx = this.inputs.indexOf(item);
        if (idx != -1) {
          return this.inputs.splice(idx, 1);
        }
        return false;
      },
    }

    public getInput(obj) {
      const input = $('<input/>', {
        type: 'text',
        placeholder: obj.text,
      }).appendTo(this.settingsPanel)
        .on('input', () => {
          obj.mounted(input.val());
        });

      this.inputList.inputs.push(input);

      return input;
    }

    public getRadio(obj, name = null) {
      const labelForRadio = $('<label/>', {
        text: obj.text,
      }).appendTo(this.settingsPanel);
      const radio: any = $('<input/>', {
        type: 'radio',
        name,
      }).appendTo(labelForRadio)
        .on('change', () => {
          radio.is(':checked') ? obj.mounted() : obj.destroy();
        });

      this.inputList.inputs.push(labelForRadio);

      return labelForRadio;
    }

    public getCheckBox(obj) {
      const labelForCheckbox = $('<label/>', {
        type: 'checkbox',
        text: obj.text,
      }).appendTo(this.settingsPanel);
      const checkBox: any = $('<input/>', {
        type: 'checkbox',
      }).appendTo(labelForCheckbox)
        .on('change', () => {
          checkBox.is(':checked') ? obj.mounted() : obj.destroy();
        });

      this.inputList.inputs.push(labelForCheckbox);

      return labelForCheckbox;
    }

    public renderSettingsPanel(exemplar: JQuery<HTMLElement>) {
      this.settingsPanel = $('<div/>', {
        class: 'slider_settings',
      }).appendTo(exemplar);

      return this.settingsPanel;
    }

    public destroyPanel() {
      $(this.settingsPanel).remove();
    }
  }
}
