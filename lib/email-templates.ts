export const inviteTemplate = (orgName: string, acceptUrl: string) => `
<html>
  <body style="font-family: Arial, sans-serif; background:#f6f7f9; padding:24px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
      <div style="background:#0ea5e9; padding:20px; color:#ffffff;">
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="${process.env.NEXT_PUBLIC_APP_URL || ""}/images/clausify-logo.png" alt="Clausify" style="height:32px;" />
          <span style="font-size:18px; font-weight:600;">Clausify</span>
        </div>
      </div>
      <div style="padding:24px; color:#0f172a;">
        <h2 style="margin:0 0 12px 0; font-size:20px;">Convite para participar de ${orgName}</h2>
        <p style="margin:0 0 16px 0; line-height:1.6;">Você foi convidado para participar da organização ${orgName} no Clausify.</p>
        <a href="${acceptUrl}" style="display:inline-block; padding:12px 18px; background:#0ea5e9; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600;">Aceitar Convite</a>
        <p style="margin:16px 0 0 0; font-size:12px; color:#64748b;">Se você não solicitou este convite, ignore este e-mail.</p>
      </div>
    </div>
  </body>
</html>`

export const acceptedTemplate = (orgName: string, dashboardUrl: string) => `
<html>
  <body style="font-family: Arial, sans-serif; background:#f6f7f9; padding:24px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
      <div style="background:#10b981; padding:20px; color:#ffffff;">
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="${process.env.NEXT_PUBLIC_APP_URL || ""}/images/clausify-logo.png" alt="Clausify" style="height:32px;" />
          <span style="font-size:18px; font-weight:600;">Clausify</span>
        </div>
      </div>
      <div style="padding:24px; color:#0f172a;">
        <h2 style="margin:0 0 12px 0; font-size:20px;">Acesso concedido em ${orgName}</h2>
        <p style="margin:0 0 16px 0; line-height:1.6;">Seu acesso foi ativado. Você já pode entrar no Clausify.</p>
        <a href="${dashboardUrl}" style="display:inline-block; padding:12px 18px; background:#10b981; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600;">Acessar Dashboard</a>
      </div>
    </div>
  </body>
</html>`

export const welcomeOwnerTemplate = (orgName: string, dashboardUrl: string) => `
<html>
  <body style="font-family: Arial, sans-serif; background:#f6f7f9; padding:24px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
      <div style="background:#6366f1; padding:20px; color:#ffffff;">
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="${process.env.NEXT_PUBLIC_APP_URL || ""}/images/clausify-logo.png" alt="Clausify" style="height:32px;" />
          <span style="font-size:18px; font-weight:600;">Clausify</span>
        </div>
      </div>
      <div style="padding:24px; color:#0f172a;">
        <h2 style="margin:0 0 12px 0; font-size:20px;">Bem-vindo à ${orgName}</h2>
        <p style="margin:0 0 12px 0; line-height:1.6;">Você é o owner da organização. Alguns passos iniciais:</p>
        <ul style="margin:0 0 16px 18px; color:#334155;">
          <li>Convide sua equipe e defina papéis</li>
          <li>Configure domínios permitidos para convites</li>
          <li>Acesse o dashboard e comece a trabalhar</li>
        </ul>
        <a href="${dashboardUrl}" style="display:inline-block; padding:12px 18px; background:#6366f1; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600;">Ir para o Dashboard</a>
      </div>
    </div>
  </body>
</html>`
