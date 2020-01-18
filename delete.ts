// private getStateInputs (i) {
//     let activeState = this.model.getState();
//     const inputList = {
//         mounted (value) {
//             try {
//                 // if (checkValidData(Number(value), activeState)) {
//                 //     this.model.setState(controller.model.getNthPointer(i)[0], value);
//                 //     this.targetedPointer = controller.model.getNthPointer(i)[0];
//                 //     this.movePointerTo(controller.model.PercentToPx(controller.sliderParams, Number(value)));
//                 // }
//             } catch (err) {
//                 alert('Не удалось установить значение');
//                 console.log('не удалось установить значение по причине: \n', err);
//             }
//         },
//         destroy () {

//         },
//         text: this.state[i].pointerValue
//     }
//     let input = this.panel.getInput(inputList, this.panel.settingsPanel);
//     // console.log(input);
//     return input;
// }

// public initSettings(settingsEnabled: boolean): void{   
//     if (settingsEnabled === false) {
//         return null
//     }
//     const controller = this;
//     const panelBody = this.panel.renderSettingsPanel(this.sliderExemplar);
//     let inputValues: any = this.panel.inputList;

//     const refreshSlider = () => {
//         controller.view.destroySlider();
//         controller.view.renderSlider(controller.sliderExemplar);
//         controller.view.renderPointer(controller.model.getPointerCount(controller.sliderType));
//         controller.AccessToDragging();
//     }

//     const stepSizeInput = {
//         mounted (stepSize) {
//             controller.model.setStepSize(stepSize)
//         },
//         text: 'шаг'
//     }

//     const showValueCheckbox: object = {
//         mounted () {
//             controller.getValueIndicator(controller.state)
//         }, 
//         destroy () {
//             controller.view.removeValueIndicator();
//         },
//         text: 'Показывать значение'
//     };

//     const horizontalViewCheckbox = {
//         mounted () {
//             controller.setViewType('horizontal');
//             refreshSlider();
//             controller.setSliderType(controller.sliderType);
//         },
//         destroy () {
//             controller.view.destroySlider();
//         },
//         text: 'Горизонтальный вид'
//     };

//     const verticalViewCheckbox = {
//         mounted () {
//             controller.setViewType('vertical');
//             refreshSlider();
//             controller.setSliderType(controller.sliderType);
//         },
//         destroy () {
//             controller.view.destroySlider();
//         },
//         text: 'Вертикальный вид'
//     }

//     const singleValueCheckbox = {
//         mounted () {
//             controller.panel.destroyInput(inputValues);
//             controller.setSliderType('singleValue');
//             refreshSlider();

//             for (let i = 0; i < controller.state.length; i++) {
                
//                 controller.model.observer.subscribe(data => {
//                     for (let i = 0; i < data.somedata.length; i++) {
//                         controller.getStateInputs(i)
//                         // $(stateInput.input).val(data.somedata[i].pointerValue);
//                     }
//                 })
//             }
//         },

//         destroy () {
//             controller.view.pointer.destroyPointers();
//             controller.panel.destroyInput(inputValues);
//             inputValues = [];
//             controller.model.observer.unsubscribe(data => {
//                 for (let i = 0; i < data.somedata.length; i++) {
//                     // controller.panel.inputList[i].val(data.somedata[i].pointerValue);
//                 }
//             });
//         },
//         text: 'одиночное значение'
//     }

//     const doubleValueCheckbox = {
//         mounted () {
//             controller.panel.destroyInput(inputValues);
//             controller.setSliderType('doubleValue');
//             refreshSlider();
//             for (let i = 0; i < controller.state.length; i++) {
//                 controller.getStateInputs(i);
//             }

//             controller.model.observer.subscribe(data => {
//                 for (let i = 0; i < data.somedata.length; i++) {
//                     controller.panel.inputList[i].val(data.somedata[i].pointerValue);
//                 }
//             })
//         },

//         destroy () {
//             controller.view.pointer.destroyPointers();
//             controller.panel.destroyInput(inputValues);
//             inputValues = [];
//             controller.model.observer.unsubscribe(data => {
//                 for (let i = 0; i < data.somedata.length; i++) {
//                     controller.panel.inputList[i].val(data.somedata[i].pointerValue);
//                 }
//             });
//         },
//         text: 'интервал'
//     }

//     let checkValidData = (value: any, state) => {
//         if (value < controller.model.valueFrom || value > controller.model.valueTo) {
//             return  false;
//         } else {
//             return true;
//         }
//     }

//     const stepSize = controller.panel.getInput(stepSizeInput);
//     const showValue = controller.panel.getCheckBox(showValueCheckbox);
//     const horizontalView = controller.panel.getCheckBox(horizontalViewCheckbox);
//     const verticalView = controller.panel.getCheckBox(verticalViewCheckbox);
//     const singleValue = controller.panel.getCheckBox(singleValueCheckbox);
//     const doubleValue = controller.panel.getCheckBox(doubleValueCheckbox);

//     const defaultViewType = () => {
//         switch (controller.view.viewType) {
//             case 'horizontal':
//                 horizontalView.checkbox.prop('checked', true)
//                 break
//             case 'vertical':
//                 verticalView.checkbox.prop('checked', true)
//                 break
//         }
//     }

//     // select default view type checkbox
//     defaultViewType();

//     const uncheck = (checkBoxList: any) => {
//         checkBoxList.map((itm) => itm.checkbox.prop('checked', false));
//     }

//     singleValue.checkbox.on('change', () => {
//         if (doubleValue.checkbox.is(':checked')) {
//             uncheck([showValue, doubleValue]);
//         }
//     })

//     doubleValue.checkbox.on('change', () => {
//         if (singleValue.checkbox.is(':checked')) {
//             uncheck([showValue, singleValue]);
//         }
//     })

//     horizontalView.checkbox.on('change', () => {
//         if (verticalView.checkbox.is(':checked')) {
//             uncheck([verticalView, showValue]);
//         }
//     })

//     verticalView.checkbox.on('change', () => {
//         if (horizontalView.checkbox.is(':checked')) {
//             uncheck([showValue, horizontalView]);
//         }
//     })
// }