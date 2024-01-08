import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";


interface outcome {
    actionSectionTitle: {
        value: string
    },
    definitionSectionTitle: {
        value: string
    },
    whySectionTitle: {value: string},
    howSectionTitle: {
        value: string
    },
    id: string,
    name: string,
    outcomeTexts: {
        results: Array<outcomeText>
    },
    title: {value: string},
    toolsAndCalculatorsSectionTitle: {value: string},
    
    guideCategory: {
        targetItem: {
            id: string,
            type: {
                value: string,
            }
        }
    }
}

interface DisplayCondition {
    [id: string]: Array<string>;
}

interface RelevantSelection {
    [id: string]: Array<{id: string, title: string}>;
}

interface outcomeText {
    id: string,
    name: string,
    displayCondition: {
        value: string;
    },
    outcomeSectionType: {
        targetItem: {
            id: string,
            typeName: {value: string}
        },
        textContent: {value: string}
    }
    relevantGuide?: {
        value: string;
    }
}

interface InitialState {
    outcomes: Array<outcome>,
    displayingOutcome: outcome,
    displayCondition: DisplayCondition;
    relevantSelection: RelevantSelection;
    tooltips: Array<{type: string, content: string}> ;
    isLoading: boolean,
  }


const initialState: InitialState = {
    outcomes: [],
    displayingOutcome: {
        actionSectionTitle: {
            value: ""
        },
        definitionSectionTitle: {
            value: ""
        },
        howSectionTitle: {
            value: ""
        },
        id: "",
        name: "",
        outcomeTexts: {
            results: []
        },
        title: {value: ""},
        toolsAndCalculatorsSectionTitle: {value: ""},
        whySectionTitle: {value: ""},
        guideCategory: {
            targetItem: {
                id: "",
                type: {
                    value: "string",
                }
            }
        }
    },
    displayCondition: {},
    relevantSelection: {},
    tooltips: [],
    isLoading: false,
}

const OR = "|-or-";
const AND = "&-and-";
const START = "-start-";
const END = "-end-";


  /* Example of condition */
    /*
    -start-
    (D730C733DAC54858A61F50EC241FB397&-and-A2E0A8A731A640A1824D78B306C3FC07&-and-1B66377AFC99497D8847F43034850F7A)
    -end-
    |-or-
    -start-
    (D730C733DAC54858A61F50EC241FB397&-and-665A6ACA57304047A0B82C2FCF83BF38&-and-1B66377AFC99497D8847F43034850F7A)
    -end-

    // Convert strings into objects with arrays;
    const example = {
        "[outomeID]": [
            ['D730C733DAC54858A61F50EC241FB397', 'A2E0A8A731A640A1824D78B306C3FC07', '1B66377AFC99497D8847F43034850F7A'],
            ['D730C733DAC54858A61F50EC241FB397', '665A6ACA57304047A0B82C2FCF83BF38', '1B66377AFC99497D8847F43034850F7A'],
        ]
    }
    */
export const outcomes = createSlice({
    name: "outcomes",
    initialState,
    reducers: {
        setOutcomes: (state, action: PayloadAction<{outcomesUnderGuide: Array<outcome>, outcomesOutsideOfGuide: Array<outcomeText>, tooltipsforGuideCategorization: any ,tilesSelected: Array<{id: string, title: string}>}>) => {
            const outcomesUnderGuide: Array<outcome> = [...action.payload.outcomesUnderGuide];
            const outcomesOutsideOfGuide: Array<outcomeText> = [...action.payload.outcomesOutsideOfGuide];
            const tilesSelected = [...action.payload.tilesSelected];
            const tooltips = [...action.payload.tooltipsforGuideCategorization];

            const outcomes: Array<outcome> = [];
            const displayCondition: DisplayCondition = {};
            const relevantSelection: RelevantSelection = {};
          
            outcomesUnderGuide.map((outcome: outcome) => {

                //combine outcomes inside and outside guide
                const filterTexts = outcomesOutsideOfGuide.filter((outcomeText: outcomeText) => outcome.id === outcomeText.relevantGuide?.value.replace(/-|{|}/g, ''))
                if(filterTexts.length > 0) {
                    outcome.outcomeTexts.results.push(...filterTexts);
                }
                //generate displayCondition obj
                outcome.outcomeTexts.results.map((outcomeText: outcomeText) => {
                    const conditionString = outcomeText.displayCondition.value;
                    //first, let's split the string on "OR";
                    const conditionsArray = conditionString.split(OR);
                    const conditionsArrayEdit: any = []
                    conditionsArray.map((condition: string) => {
                        //then group id's "AND" in arrays
                        conditionsArrayEdit.push(condition.replace(START, "").replace(END,"").replace("(", "").replace(")", "").split(AND));
                    });
                    displayCondition[outcomeText.id] = conditionsArrayEdit;
                })
  
                const outcomeTemp: outcome = {...outcome}
                //filter items that have outcomeTexts to show
                outcomeTemp.outcomeTexts.results = outcome.outcomeTexts.results.filter( (outcomeText: outcomeText) => {
                    return displayCondition[outcomeText.id].some((arr: any) => arr.every((id: string) => tilesSelected.some((item: {id: string, title: string}) => item.id === id)));
                });

            
                if (outcomeTemp.outcomeTexts.results.length > 0) {

                    outcomes.push(outcome);
                    //generate obj with relevant selection
                    const yourSelectionTemp: Array<Array<string>> = []
                    outcomeTemp.outcomeTexts.results.map((outcomeText: outcomeText) => {
                        yourSelectionTemp.push(displayCondition[outcomeText.id].flat());
                    })
                    // merging arrays
                    const yourSelectionFlat = yourSelectionTemp.flat();
                    // removing duplicates
                    const yourSelectionResolved = yourSelectionFlat.filter((item, index) => yourSelectionFlat.indexOf(item) === index);
                    // matching and retrieving titles of tiles selected
                    const yourSelectionResolvedTitles = tilesSelected.filter((item) => yourSelectionResolved.includes(item.id))
                    relevantSelection[outcome.id] = yourSelectionResolvedTitles;
                } 
            })

            return {
                ...state,
                outcomes: outcomes,
                displayingOutcome: outcomes.length > 0 ? outcomes[0] : initialState.displayingOutcome,
                isLoading: false,
                displayCondition: displayCondition,
                relevantSelection: relevantSelection,
                tooltips: tooltips,
            } as InitialState
        },

        selectOutcome: (state, action: PayloadAction<{id: string}>) => {
            const currentState: { outcomes: Array<outcome>} = current(state)
            const id = action.payload.id;
            
            // find section by id
            const outcome = currentState.outcomes.find((outcome: outcome) => outcome.id === id)
            return {
                ...state,
                displayingOutcome: outcome,
            } as InitialState
        },

        loadingOutcomes: (state, action: PayloadAction<{isLoading: boolean}>) => {
            return {
                ...state,
                isLoading: action.payload.isLoading
            }
        }

        
    }
})

export const {setOutcomes, selectOutcome, loadingOutcomes} = outcomes.actions;

export default outcomes.reducer;
