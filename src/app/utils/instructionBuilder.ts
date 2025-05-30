export function buildSystemInstruction(opts: {
    useProfile: boolean;
    formattedReviews?: string;
}): string {
    let instr = `You are a game recommendation assistant.
Only reply in JSON format. Return exactly 10 games, each with a title, year of release, and a non-spoiler reason why it fits the user's prompt. If no prompt, generate 10 random good games.
Do not use regular text or any explanation.`;

    if (opts.useProfile && opts.formattedReviews) {
        instr += `

Also, use the user's game reviews to inform your recommendations.
The user has rated the following games. Please analyze their reviews and ratings to decide on games they might like, taking into account games they dislike or hate:
${opts.formattedReviews}`;
    }

    return instr;
}