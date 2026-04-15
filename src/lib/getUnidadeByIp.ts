// src/lib/getUnidadeByIp.ts
export function getUnidadeByIp(ip: string | null): number | null {
  if (!ip) return null;
  
  console.log("🌐 IP RAW:", ip);  // DEBUG
  
  // ✅ LIMPA IPv6 ::ffff:
  let cleanIp = ip;
  if (ip.startsWith('::ffff:')) {
    cleanIp = ip.replace('::ffff:', '');
  }
  
  // ✅ Remove porta :8080
  cleanIp = cleanIp.split(':')[0];
  
  console.log("🌐 IP CLEAN:", cleanIp);  // DEBUG
  
  const parts = cleanIp.split('.');
  if (parts.length < 3) return null;
  
  const prefix = `${parts[0]}.${parts[1]}.${parts[2]}`;
  const map: Record<string, number> = {
    '172.16.1': 4,   // Pirapozinho
    '172.16.11': 4,   // Pirapozinho
    '172.16.12': 4,   // Pirapozinho
    '172.16.13': 4,   // Pirapozinho
    '172.16.14': 4,   // Pirapozinho
    '172.16.15': 4,   // Pirapozinho
    '172.16.16': 4,   // Pirapozinho
    '172.16.17': 4,   // Pirapozinho
    '172.16.18': 4,   // Pirapozinho

    '172.16.2': 2,   // Nova Andradina
    '172.16.21': 2,  // Nova Andradina
    '172.16.22': 2,  // Nova Andradina
    '172.16.23': 2,  // Nova Andradina
    '172.16.24': 2,  // Nova Andradina
    '172.16.25': 2,  // Nova Andradina
    '172.16.26': 2,  // Nova Andradina
    '172.16.27': 2,  // Nova Andradina
    '192.168.0': 4,
  
    '172.16.28': 1,  // Rochedo
    '172.16.29': 1,  // Rochedo
    '172.16.3': 1,   // Rochedo
    '172.16.31': 1,   // Rochedo
    '172.16.32': 1,   // Rochedo
    '172.16.33': 1,   // Rochedo
    '172.16.34': 1,   // Rochedo
    '172.16.35': 1,   // Rochedo
    '172.16.36': 1,   // Rochedo
    '172.16.37': 1,   // Rochedo
    '172.16.38': 1,   // Rochedo
    '172.16.39': 1,   // Rochedo

    '172.16.4': 3,   // Barra dos Bugres
    '172.16.41': 3,  // Barra dos Bugres
    '172.16.42': 3,  // Barra dos Bugres
    '172.16.43': 3,  // Barra dos Bugres
    '172.16.44': 3,  // Barra dos Bugres
    '172.16.45': 3,  // Barra dos Bugres
    '172.16.46': 3,  // Barra dos Bugres
    '172.16.47': 3,  // Barra dos Bugres
    '172.16.48': 3,  // Barra dos Bugres
    '172.16.49': 3,  // Barra dos Bugres

    '127.0.0': 2,    // LOCALHOST
  };
  
  const unidade = map[prefix] ?? null;
  console.log("📍 Prefix:", prefix, "→ Unidade:", unidade);
  return unidade;
}
