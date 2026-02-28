const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max, dec) => parseFloat((Math.random() * (max - min) + min).toFixed(dec));

const G = 9.8; // Gravity in Physics 20 standard

window.PhysicsQuestionBank = {
    flat:[
        // Type 1: Find Net Force
        function() {
            let m = rand(2, 12);
            let fa = rand(40, 150);
            let ff = rand(10, 35);
            
            let fnet = fa - ff;
            let correctAns = `${fnet} \\text{ N right}`;
            
            let distractors =[
                `${fa + ff} \\text{ N right}`,
                `${fa} \\text{ N right}`,
                `${ff} \\text{ N left}`
            ];

            return { 
                prompt: `\\text{A block } (${m} \\text{ kg}) \\text{ is pushed right with } F_a = ${fa} \\text{ N. The force of friction is } ${ff} \\text{ N. What is } F_{net}?`, 
                answer: correctAns, 
                distractors: distractors 
            };
        },
        // Type 2: Find Acceleration
        function() {
            let m = rand(2, 10);
            let fa = rand(30, 100);
            let ff = rand(5, 20);
            
            let fnet = fa - ff;
            let a = (fnet / m).toFixed(1);
            let correctAns = `${a} \\text{ m/s}^2`;
            
            let distractors =[
                `${(fa / m).toFixed(1)} \\text{ m/s}^2`,
                `${((fa + ff) / m).toFixed(1)} \\text{ m/s}^2`,
                `${(ff / m).toFixed(1)} \\text{ m/s}^2`
            ];

            return { 
                prompt: `\\text{A } ${m} \\text{ kg box is pushed with } F_a = ${fa} \\text{ N right. Friction is } ${ff} \\text{ N left. Find the acceleration.}`, 
                answer: correctAns, 
                distractors: distractors 
            };
        },
        // Type 3: Find Coefficient of Friction
        function() {
            let m = rand(5, 15);
            let ff = rand(15, 45);
            let fn = parseFloat((m * G).toFixed(1));
            let mu = (ff / fn).toFixed(2);
            
            let correctAns = `\\mu_k = ${mu}`;
            
            let distractors =[
                `\\mu_k = ${(ff / m).toFixed(2)}`,
                `\\mu_k = ${(fn / ff).toFixed(2)}`,
                `\\mu_k = ${(m / ff).toFixed(2)}`
            ];

            return { 
                prompt: `\\text{A } ${m} \\text{ kg block experiences a kinetic friction force of } ${ff} \\text{ N on a horizontal surface } (g = 9.8). \\text{ Find } \\mu_k.`, 
                answer: correctAns, 
                distractors: distractors 
            };
        }
    ],
    incline:[
        // Type 1: Parallel force of gravity
        function() {
            let m = rand(2, 10);
            let angles =[30, 45, 60];
            let theta = angles[Math.floor(Math.random() * angles.length)];
            
            // Fg_parallel = mg sin(theta)
            let rad = theta * (Math.PI / 180);
            let fg_parallel = (m * G * Math.sin(rad)).toFixed(1);
            
            let correctAns = `${fg_parallel} \\text{ N}`;
            
            let distractors =[
                `${(m * G * Math.cos(rad)).toFixed(1)} \\text{ N}`,
                `${(m * G).toFixed(1)} \\text{ N}`,
                `${(m * Math.sin(rad)).toFixed(1)} \\text{ N}`
            ];

            return { 
                prompt: `\\text{A } ${m} \\text{ kg block rests on a } ${theta}^\\circ \\text{ incline. Calculate the component of gravity parallel to the incline } (F_{g||}).`, 
                answer: correctAns, 
                distractors: distractors 
            };
        },
        // Type 2: Acceleration down frictionless incline
        function() {
            let m = rand(2, 15); // Mass technically doesn't matter for a = g sin(theta) but is good for the question
            let angles = [30, 45, 60];
            let theta = angles[Math.floor(Math.random() * angles.length)];
            
            let rad = theta * (Math.PI / 180);
            let a = (G * Math.sin(rad)).toFixed(1);
            
            let correctAns = `${a} \\text{ m/s}^2`;
            
            let distractors =[
                `${(G * Math.cos(rad)).toFixed(1)} \\text{ m/s}^2`,
                `${G.toFixed(1)} \\text{ m/s}^2`,
                `${(m * G * Math.sin(rad)).toFixed(1)} \\text{ m/s}^2` // This is force, common mistake
            ];

            return { 
                prompt: `\\text{A } ${m} \\text{ kg block slides down a frictionless } ${theta}^\\circ \\text{ incline. Find its acceleration.}`, 
                answer: correctAns, 
                distractors: distractors 
            };
        },
        // Type 3: Normal Force on incline
        function() {
            let m = rand(5, 20);
            let angles =[30, 45, 60];
            let theta = angles[Math.floor(Math.random() * angles.length)];
            
            let rad = theta * (Math.PI / 180);
            let fn = (m * G * Math.cos(rad)).toFixed(1);
            
            let correctAns = `${fn} \\text{ N}`;
            
            let distractors =[
                `${(m * G * Math.sin(rad)).toFixed(1)} \\text{ N}`,
                `${(m * G).toFixed(1)} \\text{ N}`,
                `${(m * Math.cos(rad)).toFixed(1)} \\text{ N}`
            ];

            return { 
                prompt: `\\text{A } ${m} \\text{ kg block sits on a } ${theta}^\\circ \\text{ incline. Find the normal force } (F_N).`, 
                answer: correctAns, 
                distractors: distractors 
            };
        }
    ],
    pulley:[
        // Type 1: Atwood Machine Acceleration
        function() {
            let m1 = rand(5, 12);
            let m2 = rand(1, m1 - 1); // m1 > m2
            
            // a = (m1 - m2)g / (m1 + m2)
            let a = (((m1 - m2) * G) / (m1 + m2)).toFixed(1);
            
            let correctAns = `${a} \\text{ m/s}^2`;
            
            let distractors =[
                `${(((m1 - m2) * G) / m1).toFixed(1)} \\text{ m/s}^2`,
                `${(((m1 + m2) * G) / (m1 - m2)).toFixed(1)} \\text{ m/s}^2`,
                `${(m1 * G / (m1 + m2)).toFixed(1)} \\text{ m/s}^2`
            ];

            return { 
                prompt: `\\text{Two masses, } m_1 = ${m1} \\text{ kg and } m_2 = ${m2} \\text{ kg, hang from a frictionless pulley. Find the system's acceleration.}`, 
                answer: correctAns, 
                distractors: distractors 
            };
        },
        // Type 2: Modified Atwood Machine Acceleration
        function() {
            let m1 = rand(4, 10); // Hanging mass
            let m2 = rand(2, 8);  // Mass on table
            
            // Assuming table is frictionless: a = m1*g / (m1 + m2)
            let a = ((m1 * G) / (m1 + m2)).toFixed(1);
            
            let correctAns = `${a} \\text{ m/s}^2`;
            
            let distractors =[
                `${(G).toFixed(1)} \\text{ m/s}^2`,
                `${(((m1 - m2) * G) / (m1 + m2)).toFixed(1)} \\text{ m/s}^2`,
                `${((m1 * G) / m2).toFixed(1)} \\text{ m/s}^2`
            ];

            return { 
                prompt: `\\text{Mass } m_1 = ${m1} \\text{ kg hangs off a frictionless table connected to } m_2 = ${m2} \\text{ kg on the table. Find the acceleration.}`, 
                answer: correctAns, 
                distractors: distractors 
            };
        },
        // Type 3: Find Tension in modified Atwood
        function() {
            let m1 = rand(5, 10); // Hanging
            let m2 = rand(3, 7);  // Table
            
            // a = m1*g / (m1 + m2)
            // T = m2 * a
            let a = (m1 * G) / (m1 + m2);
            let t = (m2 * a).toFixed(1);
            
            let correctAns = `${t} \\text{ N}`;
            
            let distractors =[
                `${(m1 * G).toFixed(1)} \\text{ N}`,
                `${(m2 * G).toFixed(1)} \\text{ N}`,
                `${((m1 - m2) * G).toFixed(1)} \\text{ N}`
            ];

            return { 
                prompt: `\\text{Hanging mass } m_1 = ${m1} \\text{ kg pulls } m_2 = ${m2} \\text{ kg across a frictionless table. Find the tension in the string.}`, 
                answer: correctAns, 
                distractors: distractors 
            };
        }
    ]
};