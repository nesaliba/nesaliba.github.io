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
            `I love to bake; I bake cookies every day.`,
            [`I love to bake I bake cookies every day.`, `I love to bake, and bake cookies every day.`, `I love to bake. Because I bake cookies every day.`]
        ),
        () => buildQuestion(
            `The team of players are arriving today.`,
            `The team of players is arriving today.`,
            [`The teams of players is arriving today.`, `The team of player are arriving today.`, `The team of players be arriving today.`]
        ),
        () => buildQuestion(
            `He likes swimming, to hike, and running.`,
            `He likes swimming, hiking, and running.`,
            [`He likes to swim, hiking, and to run.`, `He likes swimming, to hike, and to run.`, `He likes to swim, to hike, and running.`]
        ),
        () => buildQuestion(
            `Although she was tired. She finished her essay.`,
            `Although she was tired, she finished her essay.`,
            [`Although she was tired; she finished her essay.`, `Although she was tired she finished her essay.`, `She was tired, although she finished her essay.`]
        ),
        () => buildQuestion(
            `The weather is very hot today, we should go to the beach.`,
            `The weather is very hot today, so we should go to the beach.`,
            [`The weather is very hot today, going to the beach.`, `The weather is very hot today we should go to the beach.`, `Because the weather is very hot today, and we should go to the beach.`]
        ),
        () => buildQuestion(
            `Each of the students have a laptop.`,
            `Each of the students has a laptop.`,
            [`Each of the student have a laptop.`, `Each of the students having a laptop.`, `Each of the students are having a laptop.`]
        ),
        () => buildQuestion(
            `Me and Sarah went to the store.`,
            `Sarah and I went to the store.`,
            [`Sarah and me went to the store.`, `Me and Sarah goes to the store.`, `I and Sarah went to the store.`]
        ),
        () => buildQuestion(
            `There is many reasons to celebrate.`,
            `There are many reasons to celebrate.`,
            [`There is many reason to celebrate.`, `There are much reasons to celebrate.`, `There many reasons are to celebrate.`]
        ),
        () => buildQuestion(
            `He don't like vegetables.`,
            `He doesn't like vegetables.`,
            [`He don't likes vegetables.`, `He doesn't likes vegetables.`, `He not like vegetables.`]
        ),
        () => buildQuestion(
            `Its raining outside.`,
            `It's raining outside.`,
            [`Its' raining outside.`, `It raining outside.`, `It's raining outside`]
        ),
        () => buildQuestion(
            `She can sings very well.`,
            `She can sing very well.`,
            [`She can singing very well.`, `She sings can very well.`, `She can to sing very well.`]
        ),
        () => buildQuestion(
            `The dog chased it's tail.`,
            `The dog chased its tail.`,
            [`The dog chased its' tail.`, `The dog chase its tail.`, `The dog chased it tail.`]
        )
    ],

    resident:[
        () => buildQuestion(
            `Running to catch the bus, my backpack fell open.`,
            `As I was running to catch the bus, my backpack fell open.`,
            [`Running to catch the bus, the backpack fell open.`, `My backpack fell open, running to catch the bus.`, `Falling open, I was running to catch the bus with my backpack.`]
        ),
        () => buildQuestion(
            `She almost scored ten goals this season.`,
            `She scored almost ten goals this season.`,
            [`Almost she scored ten goals this season.`, `She scored ten goals almost this season.`, `She scored ten almost goals this season.`]
        ),
        () => buildQuestion(
            `Either you must clean your room or do the dishes.`,
            `You must either clean your room or do the dishes.`,
            [`Either you clean your room or must do the dishes.`, `You either must clean your room or doing the dishes.`, `Must you either clean your room or do the dishes.`]
        ),
        () => buildQuestion(
            `The student who won the award, was very happy.`,
            `The student who won the award was very happy.`,
            [`The student, who won the award was very happy.`, `The student, who won the award, were very happy.`, `The student who won the award, is very happy.`]
        ),
        () => buildQuestion(
            `We bought apples, oranges, and ate bananas.`,
            `We bought apples and oranges, and we ate bananas.`,
            [`We bought apples, oranges, and eating bananas.`, `We bought apples, oranges; and ate bananas.`, `We bought apples and oranges, and ate bananas.`]
        ),
        () => buildQuestion(
            `After reviewing the evidence, the verdict was reached.`,
            `After reviewing the evidence, the jury reached a verdict.`,
            [`After reviewing the evidence, the verdict was being reached.`, `Reviewing the evidence, the verdict reached.`, `The verdict was reached, after reviewing the evidence.`]
        ),
        () => buildQuestion(
            `The book that I borrowed it was fascinating.`,
            `The book that I borrowed was fascinating.`,
            [`The book which I borrowed it was fascinating.`, `The book that I borrowed, it was fascinating.`, `The book I borrowed it was fascinating.`]
        ),
        () => buildQuestion(
            `Hardly had I arrived when it started to rain.`,
            `Hardly had I arrived when it started to rain.`,
            [`Hardly I had arrived when it started to rain.`, `I had hardly arrived than it started to rain.`, `Hardly had I arrived than it started to rain.`]
        ),
        () => buildQuestion(
            `She is one of those teachers who inspires their students.`,
            `She is one of those teachers who inspire their students.`,
            [`She is one of those teachers who inspires her students.`, `She is one of those teacher who inspire their students.`, `She is one of those teachers whom inspire their students.`]
        ),
        () => buildQuestion(
            `He not only plays the guitar but also the piano.`,
            `He plays not only the guitar but also the piano.`,
            [`He not only plays the guitar but also plays the piano.`, `He plays the guitar not only but also the piano.`, `Not only he plays the guitar but also the piano.`]
        ),
        () => buildQuestion(
            `Between you and I, this is a bad idea.`,
            `Between you and me, this is a bad idea.`,
            [`Between you and myself, this is a bad idea.`, `Between you and I am, this is a bad idea.`, `Between I and you, this is a bad idea.`]
        ),
        () => buildQuestion(
            `The committee have made their decision.`,
            `The committee has made its decision.`,
            [`The committee has made their decision.`, `The committee have made its decision.`, `The committees has made its decision.`]
        )
    ],

    attending:[
        () => buildQuestion(
            `The novel was read by the entire class in one week.`,
            `The entire class read the novel in one week.`,
            [`In one week, the novel was read by the entire class.`, `The novel, in one week, was read by the entire class.`, `Reading the novel in one week was done by the entire class.`]
        ),
        () => buildQuestion(
            `At this point in time, we are currently experiencing a delay.`,
            `We are currently experiencing a delay.`,
            [`At this current point in time, we are experiencing a delay.`, `We are currently experiencing a delay at this point in time.`, `Currently, at this point in time, there is a delay.`]
        ),
        () => buildQuestion(
            `She utilizes her phone to elucidate the directions.`,
            `She uses her phone to explain the directions.`,
            [`She uses her phone to elucidate the directions.`, `She utilizes her phone to explain the directions.`, `She utilizes her mobile device to explain the directions.`]
        ),
        () => buildQuestion(
            `There are many students who want to participate in the play.`,
            `Many students want to participate in the play.`,
            [`It is true that many students want to participate in the play.`, `There exists many students wanting to participate in the play.`, `Of the students, there are many who want to participate in the play.`]
        ),
        () => buildQuestion(
            `The reason why he failed is because he didn't study.`,
            `He failed because he didn't study.`,
            [`The reason he failed is because he didn't study.`, `He failed due to the reason that he didn't study.`, `The reason why he failed was that he didn't study.`]
        ),
        () => buildQuestion(
            `It is a known fact that the process is considered to be difficult.`,
            `The process is difficult.`,
            [`The process is considered to be a difficult known fact.`, `It is known that the process is considered difficult.`, `The known fact is that the process is difficult.`]
        ),
        () => buildQuestion(
            `Due to the fact that he was late, he missed the meeting.`,
            `Because he was late, he missed the meeting.`,
            [`Due to he was late, he missed the meeting.`, `Due to the fact he was late, he missed the meeting.`, `Because of he was late, he missed the meeting.`]
        ),
        () => buildQuestion(
            `The experiment was conducted by the researchers in order to test the hypothesis.`,
            `The researchers conducted the experiment to test the hypothesis.`,
            [`The experiment was conducted to test the hypothesis by the researchers.`, `In order to test the hypothesis, the experiment was conducted by researchers.`, `The researchers conducted the experiment in order to testing the hypothesis.`]
        ),
        () => buildQuestion(
            `What is important is are the results.`,
            `What is important is the results.`,
            [`What are important is the results.`, `What is important are the results.`, `What important is the results.`]
        ),
        () => buildQuestion(
            `If I would have known, I would have acted differently.`,
            `If I had known, I would have acted differently.`,
            [`If I would know, I would have acted differently.`, `If I had known, I would act differently.`, `If I would have known, I would act differently.`]
        ),
        () => buildQuestion(
            `The data shows that the results is significant.`,
            `The data show that the results are significant.`,
            [`The data shows that the results are significant.`, `The data show that the results is significant.`, `The datas show that the results are significant.`]
        ),
        () => buildQuestion(
            `Having finished the report, the computer was turned off.`,
            `Having finished the report, she turned off the computer.`,
            [`Having finished the report, the computer turned off.`, `She turned off the computer, having finished the report.`, `Having finished the report, the computer was turning off.`]
        )
    ]
};