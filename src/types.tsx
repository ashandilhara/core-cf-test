
  export type section = {
    id: string,
    name: string,
    title: string,
    subtitle: string,
    allowMultipleSelection: boolean,
    isParentSection: boolean,
    tiles: Array<string>,
    shouldDisplayIf?: {
      inputId: string,
      inputValue: string,
    }
    onChangeValue?: any,
    status: {
      isDisplayed: boolean,
      isCompleted: boolean
    }
    inputsState: {
      value: Array<string> | string ,
    },
  }

  export type tile = {
    id: string,
    value: string,
    icon: string,
    title: string,
    toolTip: {
      title: string,
      content: string,
    },
    tileContent?: string,
    topics: []
   };


   export type _section = {
    id: string;
    title: {
      value: string
    };
    subtitle: {
      value: string
    };
    tiles: {
      results: Array<_tile>
    };
    allowMultipleSelection: {
      boolValue: boolean
    },
    isParentSection: {
      boolValue: boolean
    }
  };
 

  export type _tile = {
    id: string,
    tileIcon: {
      jsonValue: {
        value: string
      }
    },
    title: {value: string},
    tooltipTitle: {
      value: string
    },
    tooltipContent: {
      value: string
    },
    tileContent: {
      value: string
    }
    relevantTags: {targetItems: []},
    relatedSections: {
      results: Array<_section>
    }
  }



export type OutcomesValueData = {
  outcomesUnderGuide:{
    [x: string]: any;
    id: string;
    name: string;
    displayName: string
    text: {
        value: string
    };
    outcomes: {
      results: []
    };
    };
    outcomesOutsideOfGuide: {
      results: []
    }
    ToolTipsforGuideCategorization: {
      tooltips: {
        results: []
      }
    };
};

export type GuideValueData = {
  datasource:{
    [x: string]: any;
    id: string;
    name: string;
    displayName: string
    text: {
        value: string
    };
    outcomes: {
      results: []
    };
    };
};

export type stage =  {
  index: number,
  name: string
  isCompleted: boolean,
  isActive: boolean
}


