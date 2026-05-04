import Groq from 'groq-sdk';

/**
 * Servicio para interactuar con la API de Groq
 * Permite realizar análisis rápidos usando modelos como Llama 3 o Mixtral.
 */
export const getGroqCompletion = async (prompt: string, systemPrompt?: string, overrideApiKey?: string) => {
  const apiKey = overrideApiKey || (import.meta as any).env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('Falta la API Key de Groq. Configúrala en el panel de Ajustes.');
  }

  const groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Necesario para ejecución desde el cliente en Vite
  });

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt || 'Eres un experto agrónomo especializado en cultivos de maíz en Nayarit, México. Responde de forma técnica pero accesible.'
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama3-8b-8192', // Modelo rápido y equilibrado
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    return chatCompletion.choices[0]?.message?.content || 'No se recibió respuesta de la IA.';
  } catch (error) {
    console.error('Error en Groq Service:', error);
    throw error;
  }
};
