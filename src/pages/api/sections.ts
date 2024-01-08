

const mockResponse = {
    sections: [
        {
            id: 'section01',
            index: 0,
            category: 'residency',
            title: 'Are you a tax resident',
            description: '',
            disclaimer: '<p>Unsure if you are a tax resident? <a href="/" target="_blank">Find out here</a>.</p>',
            type: 'tile',
            allowMultipleSelection: false,
            shouldDisplayIf: null,
            options : [
                {
                    id: 'taxi_resident',
                    image: '[somedomain]/src/yes-icon.svg',
                    title: 'Yes',
                    value: 'yes',
                    topics: ['GST', 'Tax codes'],
                },
                {
                    id: 'taxi_resident',
                    image: '[somedomain]/src/no-icon.svg',
                    title: 'No',
                    value: 'no',
                    topics: [],
                },

            ]
        },
        {
            id: 'section02',
            index: 1,
            title: 'Tell us about your situation or topics of interest',
            description: null,
            disclaimer: null,
            type: 'segment',
            allowMultipleSelection: false,
            shouldDisplayIf: [
                {
                    inputId: 'taxi_resident',
                    inputValue: 'yes',
                }
            ],
            options : [
                {
                    id: 'situation_or_topics',
                    image: null,
                    title: 'By situation',
                    value: 'situation',
                    topics: ['GST', 'Tax codes'],
                },
                {
                    id: 'situation_or_topics',
                    image: null,
                    title: 'By topic',
                    value: "topic",
                    topics: [],
                },

            ]
        },
        {
            id: 'section03',
            index: 2,
            title: 'Tell us about your situation',
            description: 'Select all those that apply',
            disclaimer: '',
            type: 'tile',
            allowMultipleSelection: true,
            shouldDisplayIf: [
                {
                    inputId: 'situation_or_topics',
                    inputValue: 'situation',
                }
            ],
            options : [
                {
                    id: 'i_have_a_job',
                    image: '[somedomain]/src/yes-icon.svg',
                    title: 'I have a job',
                    value: 'i_have_a_job',
                    topics: ['GST', 'Tax codes'],
                },
                {
                    id: 'I_have_more_than_one_job',
                    image: '[somedomain]/src/no-icon.svg',
                    title: 'I have more than one job',
                    value: "I_have_more_than_one_job",
                    topics: [],
                },
                {
                    id: 'Im_self_employed_freelancer',
                    image: '[somedomain]/src/no-icon.svg',
                    title: 'I’m self employed / freelancer',
                    value: 'Im_self_employed_freelancer',
                    topics: [],
                },

            ]
        }
    ]   
}


export default function handler(_req: any, res: any) {
    res.status(200).json(mockResponse)
  }