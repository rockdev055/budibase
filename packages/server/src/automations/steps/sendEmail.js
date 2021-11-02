module.exports.definition = {
  description: "Send an email",
  tagline: "Send email to {{inputs.to}}",
  icon: "ri-mail-open-line",
  name: "Send Email",
  type: "ACTION",
  stepId: "SEND_EMAIL",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        apiKey: {
          type: "string",
          title: "SendGrid API key",
        },
        to: {
          type: "string",
          title: "Send To",
        },
        from: {
          type: "string",
          title: "Send From",
        },
        subject: {
          type: "string",
          title: "Email Subject",
        },
        contents: {
          type: "string",
          title: "Email Contents",
        },
      },
      required: ["to", "from", "subject", "contents"],
    },
    outputs: {
      properties: {
        success: {
          type: "boolean",
          description: "Whether the email was sent",
        },
        response: {
          type: "object",
          description: "A response from the email client, this may be an error",
        },
      },
      required: ["success"],
    },
  },
}

module.exports.run = async function({ inputs }) {
  const sgMail = require("@sendgrid/mail")
  sgMail.setApiKey(inputs.apiKey)
  const msg = {
    to: inputs.to,
    from: inputs.from,
    subject: inputs.subject,
    text: inputs.contents ? inputs.contents : "Empty",
  }

  try {
    let response = await sgMail.send(msg)
    return {
      success: true,
      response,
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      response: err,
    }
  }
}
