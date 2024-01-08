import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { section, tile, _section, _tile, stage} from "src/types";

type Tiles = {
    [key: string]: tile;
}

type SectionsStatus = {
    [key: string]: {
      isDisplayed: boolean,
      isCompleted: boolean
    }
  }

type InputsState = {
    [key: string]: {
      value: Array<string> | string ;
    }
  }

type InitialState = {
    sections: Array<section>;
    inputsState: InputsState,
    sectionsStatus: SectionsStatus,
    progress: Array<stage>,
    tiles: Tiles,
    outcomeRootId: string,
  };

const initialState: InitialState = {
    sections: [],
    inputsState: {},
    sectionsStatus: {},
    progress: [
        {
            index: 0,
            name: "Introduction",
            isCompleted: true,
            isActive: false,
        },
        {
            index: 1,
            name: "About you",
            isCompleted: false,
            isActive: true,
        },
        {
            index: 2,
            name: "Your guide",
            isCompleted: false,
            isActive: false,
        }
    ],
    tiles: {},
    outcomeRootId: '',
}

export const sections = createSlice({
    name: "sections",
    initialState,
    reducers: {
        setSections: (state, action: PayloadAction<any>) => {
            const outcomeRootId = action.payload.outcomeRootId.results[0].id;
            const sectionsLoaded = action.payload.sections.results;
            const defaultInputsState: InputsState = {}
            const defaultSectionsStatus: SectionsStatus = {}
            let allSections = null
            const allTiles: Tiles = {}

            Object.values(sectionsLoaded).map((section: _section) => {

                const currentSection: section= {
                    id: section.id,
                    name: section.id,
                    title: section.title.value,
                    subtitle: section.subtitle.value,
                    allowMultipleSelection: section.allowMultipleSelection.boolValue,
                    isParentSection: section.isParentSection.boolValue,
                    tiles: [],
                    status: {
                        isDisplayed: true,
                        isCompleted: false
                    },
                    inputsState: {
                        value: [],
                    }
                }

                const relatedSections: Array<section> = []

                section.tiles.results.map((tile: _tile) => {
                    currentSection.tiles.push(tile.id)

                    allTiles[tile.id as keyof Tiles] = {
                        id: tile.id,
                        value: tile.id,
                        icon: tile.tileIcon.jsonValue.value,
                        title: tile.title.value,
                        toolTip: {
                            title: tile.tooltipTitle.value,
                            content: tile.tooltipContent.value,
                        },
                        topics: tile.relevantTags.targetItems,
                        tileContent: tile.tileContent?.value,
                    }

                    if (tile.relatedSections.results.length > 0) {
                        tile.relatedSections.results.map((relatedSection: _section, i) => {
                            const tempTiles: Array<string> = []
                            
                            relatedSection.tiles.results.map((relatedOption: _tile) => {
                                tempTiles.push(relatedOption.id)
                                allTiles[relatedOption.id as keyof Tiles] = {
                                    id: relatedOption.id,
                                    value: relatedOption.id,
                                    icon: relatedOption.tileIcon.jsonValue.value,
                                    title: relatedOption.title.value,
                                    toolTip: {
                                        title: relatedOption.tooltipTitle.value,
                                        content: relatedOption.tooltipContent.value,
                                    },
                                    topics: relatedOption.relevantTags.targetItems,
                                    tileContent: relatedOption.tileContent?.value,
                                }
                            })
                            relatedSections.push({
                                id: relatedSection.id,
                                name: relatedSection.id,
                                title: relatedSection.title.value,
                                subtitle: relatedSection.subtitle.value,
                                allowMultipleSelection: relatedSection.allowMultipleSelection.boolValue,
                                isParentSection: relatedSection.isParentSection.boolValue,
                                shouldDisplayIf:  {
                                    inputId: currentSection.id,
                                    inputValue: tile.id,
                                },
                                tiles: tempTiles,
                                status: {
                                    isCompleted: false,
                                    isDisplayed:  false,
                                },
                                inputsState: {
                                    value: [],
                                }
                            })
                            defaultSectionsStatus[relatedSection.id] = {
                                isCompleted: false,
                                isDisplayed: relatedSections[i].shouldDisplayIf ? false : true,
                            }
                        })
                    }
                })

                allSections = [currentSection, ...relatedSections];



                // then set the object which hold the info of what section must be displayed or not
                defaultSectionsStatus[section.id] = {
                    isCompleted: false,
                    isDisplayed: true,
                }
            })
            return {
                ...state,
                sections: allSections,
                inputsState: defaultInputsState,
                sectionsStatus: defaultSectionsStatus,
                tiles: allTiles,
                outcomeRootId: outcomeRootId,
            } as unknown as InitialState
        },

        updateSections: (state, action: PayloadAction<object>) => {
            const currentState = current(state)
            const {inputChange} = action.payload as any

            //Some sections can have multiple selections so their values need to be stored into array
            const prevSelection = currentState.inputsState[inputChange.id]?.value;
            let newSelection: Array<string> | string = inputChange.allowMultipleSelection ? [inputChange.event.target.value] : inputChange.event.target.value;
            if (inputChange.allowMultipleSelection && Array.isArray(prevSelection)) {
                newSelection = [inputChange.event.target.value];
                const valueIndex = prevSelection.indexOf(inputChange.event.target.value);
                if (inputChange.event.target.checked) {
                    if (valueIndex === -1) {
                      newSelection = [...prevSelection, inputChange.event.target.value];
                    }
                  } else {
                    if (valueIndex > -1) {
                      newSelection = [...prevSelection];
                      newSelection.splice(valueIndex, 1);
                    }
                  }
            }
            
            const newSectionsStatus = {...currentState.sectionsStatus};
            const newInputsState: InputsState = {
                ...currentState.inputsState,
                [inputChange.id]: {
                    value: newSelection,
                  }
            };

            currentState.sections.map(section => {
                newSectionsStatus[section.id] = {
                    isDisplayed: true,
                    isCompleted: false
                }
                if (section.shouldDisplayIf) {
                    // if it has display condition, compare the curretn input values to decide if the section needs to be displayed ot hidden
                    newSectionsStatus[section.id].isDisplayed = section.shouldDisplayIf.inputValue === newInputsState[section.shouldDisplayIf.inputId].value
                    if (!newSectionsStatus[section.id].isDisplayed) {
                        //if section needs to be hidden, delete their value from inputState
                        delete newInputsState[section.id]
                    }
                }

                if(newSectionsStatus[section.id].isDisplayed) {
                    newSectionsStatus[section.id].isCompleted = newInputsState[section.id] && newInputsState[section.id].value ? newInputsState[section.id].value.length > 0 : false;
                }
            })


            return {
               ...state,
                inputsState: newInputsState,
                sectionsStatus: newSectionsStatus,
            }
        },

        back: (state) => {
            const currentState = current(state)
            const sections = currentState.sections
            const sectionsStatus: SectionsStatus = {}
            
            // set isDisplayed as false for sections woth display conditions
            sections.map((section: section) => {
                sectionsStatus[section.id] = {
                    isCompleted: false,
                    isDisplayed: section.shouldDisplayIf ? false : true,
                }
            })

            const newStages = JSON.parse(JSON.stringify(currentState.progress));
            newStages[0].isActive = false;
            newStages[0].isCompleted = true;
            newStages[1].isCompleted = false;
            newStages[1].isActive = true;
            newStages[2].isActive = false;
            newStages[2].isCompleted = false;
            return {
                ...state,
                inputsState: {},
                sectionsStatus: sectionsStatus,
                progress: newStages
            }
        },
        next: (state) => {
            const currentState = current(state)
            const newStages = JSON.parse(JSON.stringify(currentState.progress));
            newStages[0].isActive = false;
            newStages[0].isCompleted = true;
            newStages[1].isCompleted = true;
            newStages[1].isActive = false;
            newStages[2].isActive = true;
            newStages[2].isCompleted = false;
            return {
                ...state,
                progress: newStages
            }
        }
    }
})

export const {setSections, updateSections, next, back} = sections.actions;


export default sections.reducer;