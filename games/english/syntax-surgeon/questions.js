const shuffle = (array) => array.sort(() => Math.random() - 0.5);

const buildQuestion = (prompt, answer, wrongOptions) => {
    let distractors = shuffle([...wrongOptions]).slice(0, 3);
    let options = shuffle([answer, ...distractors]);
    return { prompt, options, answer };
};

window.SyntaxQuestionBank = {
    novice:[
        () => buildQuestion(
            `I love to bake, I bake cookies every day.`,
            `I love to bake; I bake cookies every day.`,[`I love to bake I bake cookies every day.`, `I love to bake, and bake cookies every day.`, `I love to bake. Because I bake cookies every day.`]
        ),
        () => buildQuestion(
            `The team of players are arriving today.`,
            `The team of players is arriving today.`,[`The teams of players is arriving today.`, `The team of player are arriving today.`, `The team of players be arriving today.`]
        ),
        () => buildQuestion(
            `He likes swimming, to hike, and running.`,
            `He likes swimming, hiking, and running.`,[`He likes to swim, hiking, and to run.`, `He likes swimming, to hike, and to run.`, `He likes to swim, to hike, and running.`]
        ),
        () => buildQuestion(
            `Although she was tired. She finished her essay.`,
            `Although she was tired, she finished her essay.`,[`Although she was tired; she finished her essay.`, `Although she was tired she finished her essay.`, `She was tired, although she finished her essay.`]
        ),
        () => buildQuestion(
            `The weather is very hot today, we should go to the beach.`,
            `The weather is very hot today, so we should go to the beach.`,[`The weather is very hot today, going to the beach.`, `The weather is very hot today we should go to the beach.`, `Because the weather is very hot today, and we should go to the beach.`]
        ),
        () => buildQuestion(
            `Each of the students have a laptop.`,
            `Each of the students has a laptop.`,[`Each of the student have a laptop.`, `Each of the students having a laptop.`, `Each of the students are having a laptop.`]
        )
    ],
    resident:[
        () => buildQuestion(
            `Running to catch the bus, my backpack fell open.`,
            `As I was running to catch the bus, my backpack fell open.`,[`Running to catch the bus, the backpack fell open.`, `My backpack fell open, running to catch the bus.`, `Falling open, I was running to catch the bus with my backpack.`]
        ),
        () => buildQuestion(
            `She almost scored ten goals this season.`,
            `She scored almost ten goals this season.`,[`Almost she scored ten goals this season.`, `She scored ten goals almost this season.`, `She scored ten almost goals this season.`]
        ),
        () => buildQuestion(
            `Either you must clean your room or do the dishes.`,
            `You must either clean your room or do the dishes.`,[`Either you clean your room or must do the dishes.`, `You either must clean your room or doing the dishes.`, `Must you either clean your room or do the dishes.`]
        ),
        () => buildQuestion(
            `The student who won the award, was very happy.`,
            `The student who won the award was very happy.`,[`The student, who won the award was very happy.`, `The student, who won the award, were very happy.`, `The student who won the award, is very happy.`]
        ),
        () => buildQuestion(
            `We bought apples, oranges, and ate bananas.`,
            `We bought apples and oranges, and we ate bananas.`,[`We bought apples, oranges, and eating bananas.`, `We bought apples, oranges; and ate bananas.`, `We bought apples and oranges, and ate bananas.`]
        ),
        () => buildQuestion(
            `After reviewing the evidence, the verdict was reached.`,
            `After reviewing the evidence, the jury reached a verdict.`,[`After reviewing the evidence, the verdict was being reached.`, `Reviewing the evidence, the verdict reached.`, `The verdict was reached, after reviewing the evidence.`]
        )
    ],
    attending:[
        () => buildQuestion(
            `The novel was read by the entire class in one week.`,
            `The entire class read the novel in one week.`,[`In one week, the novel was read by the entire class.`, `The novel, in one week, was read by the entire class.`, `Reading the novel in one week was done by the entire class.`]
        ),
        () => buildQuestion(
            `At this point in time, we are currently experiencing a delay.`,
            `We are currently experiencing a delay.`,[`At this current point in time, we are experiencing a delay.`, `We are currently experiencing a delay at this point in time.`, `Currently, at this point in time, there is a delay.`]
        ),
        () => buildQuestion(
            `She utilizes her phone to elucidate the directions.`,
            `She uses her phone to explain the directions.`,[`She uses her phone to elucidate the directions.`, `She utilizes her phone to explain the directions.`, `She utilizes her mobile device to explain the directions.`]
        ),
        () => buildQuestion(
            `There are many students who want to participate in the play.`,
            `Many students want to participate in the play.`,[`It is true that many students want to participate in the play.`, `There exists many students wanting to participate in the play.`, `Of the students, there are many who want to participate in the play.`]
        ),
        () => buildQuestion(
            `The reason why he failed is because he didn't study.`,
            `He failed because he didn't study.`,[`The reason he failed is because he didn't study.`, `He failed due to the reason that he didn't study.`, `The reason why he failed was that he didn't study.`]
        ),
        () => buildQuestion(
            `It is a known fact that the process is considered to be difficult.`,
            `The process is difficult.`,[`The process is considered to be a difficult known fact.`, `It is known that the process is considered difficult.`, `The known fact is that the process is difficult.`]
        )
    ]
};