const { sendEmails } = require('../services')
const emailQueue = require('../queues/email.queues')

emailQueue.process(async (job, done) => {
    try {
    const { file, additionalMessage } = job.data;

    const result = await sendEmails({ file, additionalMessage });

    done(null, result); 
  } catch (error) {
    console.error('Error al procesar el trabajo:', error);
    done(error);
  }
});
