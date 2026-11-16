# Learning research for Everyday Malay

**Purpose:** translate well-supported learning principles into a small, local-first product plan. This is a design rationale, not evidence that Everyday Malay has already improved learning outcomes.

## Evidence and limits

Learning research supports retrieval practice and distributed practice for retention; task-based language teaching and interaction research support purposeful language use in context; corrective-feedback research supports feedback as part of language development; and multimedia research supports meaningful segmentation and reduced extraneous load. These findings do not validate a particular Everyday Malay lesson or prove that one interface will work for all users. Most cited language studies are not Malaysian Malay studies. The app needs its own learner testing and Malaysian language review.

## Proposed learning features

### 1. Understandable scenario input with learner control

- **Problem:** beginners cannot learn a conversation if the task is opaque or too far beyond their current language.
- **Evidence/principle:** interaction research studies how modified input, clarification, and learner output can support L2 development; task-based pedagogy emphasizes designing a task around a meaningful goal rather than a form-only drill. [Mackey 1999](https://doi.org/10.1017/S0272263199004027); [Ellis 2000](https://doi.org/10.1177/136216880000400302).
- **Everyday Malay:** each chapter opens with a concrete real-life goal, then provides a short conversation with optional English, replay, and a small number of highlighted forms. Keep unknown expressions explainable; do not add extra turns just for realism.
- **Measure:** first-time learners can state the scene goal before the task; comprehension questions improve after instruction; drop-off and repeated help requests by step.

### 2. Retrieval before reveal, then corrective feedback

- **Problem:** rereading phrase lists can create familiarity without recall or use.
- **Evidence/principle:** retrieval tests can improve delayed recall more than repeated study alone; a web-app vocabulary experiment also found effects for spacing, testing, and corrective feedback. [Karpicke & Roediger 2008](https://doi.org/10.1126/science.1152408); [Belardi et al. 2021](https://doi.org/10.3389/fpsyg.2021.766094).
- **Everyday Malay:** before showing a model response, ask the learner to retrieve a short phrase from a situation cue. On an error, identify the communicative element that is missing (for example, location vs. stopping intent), then let them try again before revealing a response. Keep accepted variants contextual and native-reviewed.
- **Measure:** delayed unprompted recall and task success after a gap; count hint/assisted use as process data, not as proficiency.

### 3. Spaced and interleaved review

- **Problem:** phrases seen only once in their original lesson are easily forgotten, while repeated identical drills can become rote.
- **Evidence/principle:** a large meta-analysis of verbal recall found spacing benefits and showed that useful intervals depend on retention delay. Interleaving has promising but task-dependent evidence; do not assume one schedule fits every item. [Cepeda et al. 2006](https://doi.org/10.1037/0033-2909.132.3.354).
- **Everyday Malay:** after the core task-resume and audio work is stable, schedule a small local review queue using phrase-level outcomes (retrieved independently, hint, missed). Mix a few prior phrases with a new scenario and vary the cue direction (hear→meaning, situation→Malay). Keep a “practice now” option and do not gate Explore.
- **Measure:** proportion of due items recalled without a hint, later task transfer, review completion burden, and the percentage of reviews learners skip. Tune intervals from observed data; do not claim an optimal algorithm in advance.

### 4. Goal-driven conversation, not points-driven progression

- **Problem:** completing screens is not evidence the learner can achieve a real communication goal.
- **Evidence/principle:** task-based research treats tasks as purposeful meaning-focused activity and highlights both task design and interaction/scaffolding. [Ellis 2000](https://doi.org/10.1177/136216880000400302).
- **Everyday Malay:** keep a scene-level objective (buy water, place an order, coordinate a ride), accept reviewed natural alternatives, and let a learner recover from mistakes. XP remains a small acknowledgment for first completion; chapter progress should depend on demonstrable task outcomes, not an XP total.
- **Measure:** independently completed role-play goals, task-specific error types, and transfer to a slightly changed context; XP is a motivation/engagement signal only.

### 5. Explanatory, non-punitive feedback and gradual scaffolding

- **Problem:** binary “correct/incorrect” feedback cannot teach why a response failed; exposing the model immediately can also replace retrieval with copying.
- **Evidence/principle:** a classroom meta-analysis found oral corrective feedback can support target-language development; actual effectiveness varies by feedback type, context, and outcome measure. [Lyster & Saito 2010](https://doi.org/10.1017/S0272263109990520).
- **Everyday Malay:** use a support ladder: situation reminder → targeted clue → optional phrase bank → one suggested answer with a short meaning/usage note. Never punish hints; record the support level separately from completion.
- **Measure:** correction after a hint, ability to explain the communicative goal, and whether the same error recurs on a later spaced attempt.

### 6. Authentic listening, then intelligible speech practice

- **Problem:** synthesized voices may mispronounce colloquial Malay, regional address terms, and reduced speech; listening to text-to-speech is not equivalent to hearing a local speaker.
- **Evidence/principle:** pronunciation instruction research often prioritizes intelligibility over native-like accent; oral feedback and interaction evidence do not license automatic claims about speech-recognition accuracy. [Saito 2012](https://doi.org/10.1002/tesq.67); [Lyster & Saito 2010](https://doi.org/10.1017/S0272263109990520).
- **Everyday Malay:** use consistent, licensed recordings by proficient Malaysian speakers, with normal and carefully produced learner-paced versions. Include multiple speakers only after core scripts are approved. Let learners record themselves for comparison; do not score pronunciation unless a validated, consented assessment method exists.
- **Measure:** listening comprehension without visible text, playback failure rate, learner confidence, and independent human ratings of intelligibility on a consented sample. Do not use voice recordings as analytics by default.

### 7. Short segments, limited new material, clear signaling

- **Problem:** long phrase lists and dense cards increase extraneous cognitive load, particularly for novices.
- **Evidence/principle:** a meta-analysis of multimedia segmentation (56 investigations, 88 comparisons) found a small-to-medium benefit for learner-paced segments on retention and transfer, with context and prior-knowledge moderators. [Rey et al. 2019](https://doi.org/10.1007/S10648-018-9456-4).
- **Everyday Malay:** keep current six steps as a stable shell, but curate a smaller core phrase set per lesson; mark optional/reference items clearly. Let learners advance at their own pace, and keep the highlighted form adjacent to its dialogue use.
- **Measure:** comprehension accuracy, step time, scroll depth, phrase recall, and learner reports of overload.

### 8. Meaningful mastery and assessment

- **Problem:** a matcher pass, XP award, word-bank use, or single correct answer cannot establish speaking proficiency.
- **Evidence/principle:** retrieval studies measure specific memory outcomes; task-based language research emphasizes communicative goals. Neither licenses a broad proficiency claim from a few scripted text turns.
- **Everyday Malay:** separate started, completed, independently completed, and future mastery. A mastery rule should require a reviewed task rubric, repeated evidence, and support-use context; keep assessment scoped to the scenario outcome.
- **Measure:** scenario-specific performance across attempts and changed prompts, not XP or time-on-app. Validate rubric decisions with proficient speakers and learner research before showing mastery badges.

### 9. Motivation and local-first trust

- **Problem:** streak pressure or locked practical phrases can reward habit formation instead of useful language practice.
- **Evidence/principle:** the cited memory and task studies do not show that streaks, energy systems, or leaderboards improve Everyday Malay learning. The recommendation to avoid coercive mechanics is a product judgment grounded in the product’s practical, adult audience.
- **Everyday Malay:** keep practical phrase access available in Explore, reward first meaningful completions modestly, support learner-set practice, and make local data behavior understandable. Design Phrasebook/review as accessible quick-reference tools, not unlocks.
- **Measure:** learner-reported usefulness, return use without streak prompts, opt-out behavior, and task outcomes.

## Smallest useful learning evaluation

Before adding adaptive scheduling, run a small usability/learning pilot with beginners and a proficient Malaysian Malay reviewer:

1. Ask a learner to explain a scene objective before instruction.
2. Measure one short listening comprehension item with Malay audio and no translation shown.
3. Collect one unassisted role-play response and the learner’s confidence.
4. Re-test selected phrases after a delay and in a changed but equivalent scene.
5. Have a proficient reviewer label whether answers meet the intended communicative goal and whether alternatives are natural in the target context.

This is a product validation plan, not a clinical or proficiency certification study.

## References

- Belardi, A., Pedrett, S., Rothen, N., & Reber, T. P. (2021). “Spacing, feedback, and testing boost vocabulary learning in a web application.” *Frontiers in Psychology*, 12, 766094. [DOI](https://doi.org/10.3389/fpsyg.2021.766094).
- Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). “Distributed practice in verbal recall tasks: A review and quantitative synthesis.” *Psychological Bulletin*, 132(3), 354–380. [DOI](https://doi.org/10.1037/0033-2909.132.3.354).
- Ellis, R. (2000). “Task-based research and language pedagogy.” *Language Teaching Research*, 4(3), 193–220. [DOI](https://doi.org/10.1177/136216880000400302).
- Karpicke, J. D., & Roediger, H. L. (2008). “The critical importance of retrieval for learning.” *Science*, 319(5865), 966–968. [DOI](https://doi.org/10.1126/science.1152408).
- Lyster, R., & Saito, K. (2010). “Oral feedback in classroom SLA: A meta-analysis.” *Studies in Second Language Acquisition*, 32(2), 265–302. [DOI](https://doi.org/10.1017/S0272263109990520).
- Mackey, A. (1999). “Input, interaction, and second language development: An empirical study of question formation in ESL.” *Studies in Second Language Acquisition*, 21(4), 557–587. [DOI](https://doi.org/10.1017/S0272263199004027).
- Rey, G. D., Beege, M., Nebel, S., Wirzberger, M., Schmitt, T. H., & Schneider, S. (2019). “A meta-analysis of the segmenting effect.” *Educational Psychology Review*, 31, 389–419. [DOI](https://doi.org/10.1007/S10648-018-9456-4).
- Saito, K. (2012). “Effects of instruction on L2 pronunciation development: A synthesis of 15 quasi-experimental intervention studies.” *TESOL Quarterly*, 46(4), 842–854. [DOI](https://doi.org/10.1002/tesq.67).
