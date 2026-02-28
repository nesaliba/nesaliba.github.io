const shuffle = (array) => array.sort(() => Math.random() - 0.5);

// Helper to quickly generate a multiple choice set ensuring 4 unique options
const buildQuestion = (prompt, answer, wrongOptions) => {
    let distractors = shuffle([...wrongOptions]).slice(0, 3);
    let options = shuffle([answer, ...distractors]);
    return { prompt, options, answer };
};

window.RhetoricQuestionBank = {
    sophist:[ // Level 1: Focus on identifying and dismantling logical fallacies
        () => buildQuestion(
            `"If we ban soda in the cafeteria, next they'll ban juice, and soon we'll only be allowed to drink water!"<br><br><b>Identify the logical fallacy:</b>`,
            `Slippery Slope`,[`Ad Hominem`, `Straw Man`, `Red Herring`, `Hasty Generalization`, `Circular Reasoning`]
        ),
        () => buildQuestion(
            `"You can't trust his argument about climate change; he didn't even graduate from an Ivy League school!"<br><br><b>Identify the logical fallacy:</b>`,
            `Ad Hominem`,[`Straw Man`, `Slippery Slope`, `False Dilemma`, `Appeal to Authority`]
        ),
        () => buildQuestion(
            `Opponent: "We should allocate more funding to public libraries."<br>Response: "Why do you hate the military and want to leave our country defenseless?"<br><br><b>Identify the logical fallacy:</b>`,
            `Straw Man`,[`Red Herring`, `Ad Hominem`, `Circular Reasoning`, `Bandwagon`]
        ),
        () => buildQuestion(
            `"Either we completely defund the police, or we live in a totalitarian police state."<br><br><b>Identify the logical fallacy:</b>`,
            `False Dilemma (Black-or-White)`,[`Slippery Slope`, `Hasty Generalization`, `Straw Man`, `Red Herring`]
        ),
        () => buildQuestion(
            `"This new social media app is the best because everyone at school is downloading it!"<br><br><b>Identify the logical fallacy:</b>`,
            `Bandwagon (Ad Populum)`,[`Appeal to Authority`, `Anecdotal Fallacy`, `Post Hoc Ergo Propter Hoc`, `Circular Reasoning`]
        ),
        () => buildQuestion(
            `"Every time I wear my lucky socks, our team wins. Therefore, my socks are causing us to win."<br><br><b>Identify the logical fallacy:</b>`,
            `Post Hoc Ergo Propter Hoc`,[`Hasty Generalization`, `Circular Reasoning`, `Slippery Slope`, `Straw Man`]
        ),
        () => buildQuestion(
            `"I asked three of my friends, and they all hate the new school schedule. Clearly, the whole student body is against it."<br><br><b>Identify the logical fallacy:</b>`,
            `Hasty Generalization`,[`Ad Hominem`, `Bandwagon`, `Anecdotal Fallacy`, `False Dilemma`]
        ),
        () => buildQuestion(
            `"We know this policy is good because it is a good policy."<br><br><b>Identify the logical fallacy:</b>`,
            `Circular Reasoning (Begging the Question)`,[`Straw Man`, `Red Herring`, `Slippery Slope`, `False Dilemma`]
        ),
        () => buildQuestion(
            `"Senator: We need to talk about the rising cost of healthcare."<br>Opponent: "Speaking of costs, let me remind you how much the Senator spent renovating her office!"<br><br><b>Identify the logical fallacy:</b>`,
            `Red Herring`,[`Ad Hominem`, `Straw Man`, `Tu Quoque`, `Bandwagon`]
        ),
        () => buildQuestion(
            `"You're telling me I shouldn't eat fast food? I saw you eating a burger last week!"<br><br><b>Identify the logical fallacy:</b>`,
            `Tu Quoque (Appeal to Hypocrisy)`,[`Ad Hominem`, `Straw Man`, `Red Herring`, `Hasty Generalization`]
        ),
        () => buildQuestion(
            `"Famous actor Jake Reynolds says this is the best brand of protein powder, so it must be the most effective."<br><br><b>Identify the logical fallacy:</b>`,
            `Appeal to False Authority`, [`Bandwagon`, `Ad Hominem`, `Post Hoc Ergo Propter Hoc`, `Circular Reasoning`]
        ),
        () => buildQuestion(
            `"We've always held graduation ceremonies in June, so we should continue to do so."<br><br><b>Identify the logical fallacy:</b>`,
            `Appeal to Tradition`, [`Appeal to Authority`, `Hasty Generalization`, `Straw Man`, `Circular Reasoning`]
        ),
    ],
    demagogue:[ // Level 2: Focus on rhetorical appeals (Ethos, Pathos, Logos) and audience
        () => buildQuestion(
            `"As a doctor with two decades of experience treating respiratory illnesses, I strongly urge you to reconsider this policy."<br><br><b>Which rhetorical appeal is primarily used here?</b>`,
            `Ethos`,[`Pathos`, `Logos`, `Kairos`, `Bathos`]
        ),
        () => buildQuestion(
            `"Look into the eyes of these starving children. Can you truly turn your back on them when a donation of just $5 could save a life?"<br><br><b>Which rhetorical appeal is primarily used here?</b>`,
            `Pathos`,[`Ethos`, `Logos`, `Kairos`, `Bandwagon`]
        ),
        () => buildQuestion(
            `"Studies from the National Institute of Health indicate a 45% decrease in infection rates when the protocol is strictly followed."<br><br><b>Which rhetorical appeal is primarily used here?</b>`,
            `Logos`, [`Ethos`, `Pathos`, `Kairos`, `Anecdotal`]
        ),
        () => buildQuestion(
            `To effectively persuade an audience of skeptical scientists regarding a new environmental policy, which strategy is best?`,
            `Integrating peer-reviewed statistical evidence (Logos)`,[`Sharing an emotional personal anecdote (Pathos)`, `Attacking the previous administration (Ad Hominem)`, `Citing a popular celebrity's opinion (False Authority)`]
        ),
        () => buildQuestion(
            `Which sentence represents the strongest defensible thesis statement?`,
            `Because it fosters critical thinking and empathy, reading diverse literature should be mandatory in high schools.`,[`Reading books is good for students and teaches them a lot of things.`, `In this essay, I will discuss why schools need to read more diverse books.`, `Should students read more books? Yes, they absolutely should.`]
        ),
        () => buildQuestion(
            `"Now — in this moment of national crisis — is not the time for half-measures. We must act boldly and immediately."<br><br><b>Which rhetorical concept does the word "now" invoke by appealing to a critical moment in time?</b>`,
            `Kairos`, [`Ethos`, `Logos`, `Pathos`, `Anaphora`]
        ),
        () => buildQuestion(
            `A speaker opens a debate by saying, "I have coached high school debate for fifteen years, and I have never seen an argument more flawed than this one."<br><br><b>Which rhetorical appeal is the speaker primarily establishing?</b>`,
            `Ethos`,[`Logos`, `Pathos`, `Kairos`, `Epistrophe`]
        ),
        () => buildQuestion(
            `"Every minute we delay this legislation, another family loses their home. Another child goes hungry. Another future is stolen."<br><br><b>Which rhetorical appeal dominates this passage?</b>`,
            `Pathos`,[`Logos`, `Ethos`, `Kairos`, `Allusion`]
        ),
        () => buildQuestion(
            `"If we reduce speed limits by just 10 km/h on highways, traffic fatality models predict we would save over 400 lives annually in this province."<br><br><b>Which rhetorical appeal is primarily used?</b>`,
            `Logos`, [`Ethos`, `Pathos`, `Kairos`, `Hyperbole`]
        ),
        () => buildQuestion(
            `Which revision makes this weak thesis statement the most argumentative and specific?<br><br><i>Original: "Social media has effects on teenagers."</i>`,
            `"By displacing face-to-face interaction and amplifying social comparison, social media meaningfully increases anxiety in adolescents."`,[`"Social media is bad for teenagers and society."`, `"In this essay, I will explore how social media affects the mental health of teens."`, `"Many teenagers use social media every day, and this can have effects."`]
        ),
        () => buildQuestion(
            `A persuasive essay claims: <i>"Opponents of the four-day school week argue it harms learning. However, a Stanford meta-analysis of 60 school districts found no statistically significant drop in test scores."</i><br><br><b>What persuasive technique is being used?</b>`,
            `Concession and Rebuttal`,[`Circular Reasoning`, `Anaphora`, `Ad Hominem`, `Pathos`]
        ),
    ],
    master:[ // Level 3: Advanced synthesis, evidence integration, and historical analysis (MLK Jr. / ELA 30-1)
        () => buildQuestion(
            `In his "I Have a Dream" speech, Dr. Martin Luther King Jr. states: <i>"Five score years ago, a great American, in whose symbolic shadow we stand today, signed the Emancipation Proclamation."</i><br><br><b>What rhetorical device is primarily being used here to build credibility (Ethos)?</b>`,
            `Historical Allusion`,[`Hyperbole`, `Oxymoron`, `Ad Hominem`, `Litotes`]
        ),
        () => buildQuestion(
            `Dr. King frequently used phrases like: <i>"Let freedom ring from the prodigious hilltops of New Hampshire. Let freedom ring from the mighty mountains of New York..."</i><br><br><b>This repetitive structure is an example of:</b>`,
            `Anaphora`, [`Epistrophe`, `Chiasmus`, `Synecdoche`, `Polysyndeton`]
        ),
        () => buildQuestion(
            `You are writing an essay arguing that technology isolates teenagers. Which piece of textual evidence integrates best?`,
            `Smith notes that "despite being constantly connected digitally, 60% of teens report feeling functionally invisible" (42).`,[`Teens are isolated. "60% of teens report feeling functionally invisible" (Smith 42).`, `Smith (2020) talks about teenagers and how they are isolated and invisible.`, `As said on page 42, teens are feeling very isolated because of phones.`]
        ),
        () => buildQuestion(
            `In "Letter from Birmingham Jail," MLK Jr. addresses the clergymen who called his actions "unwise and untimely."<br><br><b>Addressing and systematically dismantling the opponent's argument is known as:</b>`,
            `Rebuttal / Refutation`,
            [`Concession`, `Confirmation`, `Exordium`, `Peroration`]
        ),
        () => buildQuestion(
            `<i>"We must learn to live together as brothers or perish together as fools."</i><br><br><b>This quote from MLK Jr. utilizes which rhetorical device to emphasize contrast?</b>`,
            `Antithesis`,[`Irony`, `Understatement`, `Metonymy`, `Personification`]
        ),
        () => buildQuestion(
            `MLK Jr. writes in "Letter from Birmingham Jail": <i>"One has not only a legal but a moral responsibility to obey just laws. Conversely, one has a moral responsibility to disobey unjust laws."</i><br><br><b>By referencing natural law and moral philosophy, King is primarily appealing to:</b>`,
            `Logos and Ethos`,[`Pathos only`, `Kairos`, `Bandwagon`, `Anecdotal Evidence`]
        ),
        () => buildQuestion(
            `<i>"Injustice anywhere is a threat to justice everywhere."</i> — MLK Jr.<br><br><b>The balanced, contrasting grammatical structure of this sentence is an example of:</b>`,
            `Antithesis`,[`Anaphora`, `Chiasmus`, `Hyperbole`, `Alliteration`]
        ),
        () => buildQuestion(
            `In "I Have a Dream," King says America has given Black citizens <i>"a bad check, a check which has come back marked 'insufficient funds.'"</i><br><br><b>This extended comparison of civil rights to a financial debt is an example of:</b>`,
            `Extended Metaphor (Conceit)`, [`Simile`, `Allusion`, `Anaphora`, `Synecdoche`]
        ),
        () => buildQuestion(
            `A student's essay uses five quotes in a single paragraph without any analysis. <b>What is the primary weakness of this approach?</b>`,
            `The evidence is not analyzed or connected to the thesis, making the argument underdeveloped.`,[`The quotes are too short to be meaningful.`, `Using multiple quotes always weakens an essay's credibility.`, `The paragraph has too many ideas and should be split into five paragraphs.`]
        ),
        () => buildQuestion(
            `Which sentence uses the most precise and academic diction for a formal ELA 30-1 essay?`,
            `King's deliberate use of antithesis underscores the moral urgency of civil disobedience.`,[`King uses opposites a lot in his writing which makes it better.`, `The way King writes shows he really wants people to understand his point about rights.`, `King's speech is good because he uses a lot of fancy words and structure.`]
        ),
        () => buildQuestion(
            `<i>"From every mountainside, let freedom ring!"</i><br><br>The use of "mountainside" to represent all of America's geography is an example of:</b>`,
            `Synecdoche`, [`Metaphor`, `Anaphora`, `Alliteration`, `Allusion`]
        ),
        () => buildQuestion(
            `In classical rhetoric, the <b>closing section</b> of a speech — where the speaker summarizes arguments and makes a final emotional appeal — is called the:</b>`,
            `Peroration`,[`Exordium`, `Narration`, `Refutation`, `Confirmation`]
        ),
    ]
};