const { sendEmails } = require('../services')
const emailQueue = require('../queues/email.queues')
console.log('🚀 ~ emailQueue:', emailQueue)

emailQueue.process(async (job, done) => {
    try {
    console.log('🚀 ~ job:', job)
    const { file, additionalMessage } = job.data;
    console.log('🚀 ~ additionalMessage:', additionalMessage)

    const result = await sendEmails({ file, additionalMessage });

    done(null, result); 
  } catch (error) {
    console.error('Error al procesar el trabajo:', error);
    done(error);
  }
});
