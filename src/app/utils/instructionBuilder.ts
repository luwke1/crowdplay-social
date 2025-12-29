export function buildSystemInstruction(opts: {
    useProfile: boolean;
    formattedReviews?: string;
}): string {
    let instr = `Act as a specialized Game Recommendation Engine.
Output Schema: Array<{"title": string, "year_released": number, "reason": string}>
reason is a small explanation of why the game exactly fits the users prompt and their taste profile if given.
Return exactly 10 games that perfectly fits the user prompt if it exists. If no prompt, generate 10 random good games.
Do not use regular text or any explanation.`;

    if (opts.useProfile && opts.formattedReviews) {
        instr += `

Also, use the user's game reviews to inform your recommendations.
The user has rated the following games. Please analyze their reviews and ratings to decide on games they might like, taking into account games they dislike or hate:
${opts.formattedReviews}`;
    }

    return instr;
}