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
    '172.16.1': 1,   // Pirapozinho
    '172.16.11': 1,   // Pirapozinho
    '172.16.12': 1,   // Pirapozinho
    '172.16.13': 1,   // Pirapozinho
    '172.16.14': 1,   // Pirapozinho
    '172.16.15': 1,   // Pirapozinho
    '172.16.16': 1,   // Pirapozinho
    '172.16.17': 1,   // Pirapozinho
    '172.16.18': 1,   // Pirapozinho

    '172.16.2': 2,   // Nova Andradina
    '172.16.21': 2,  // Nova Andradina
    '172.16.22': 2,  // Nova Andradina
    '172.16.23': 2,  // Nova Andradina
    '172.16.24': 2,  // Nova Andradina
    '172.16.25': 2,  // Nova Andradina
    '172.16.26': 2,  // Nova Andradina
    '172.16.27': 2,  // Nova Andradina
    '192.168.0': 4,
  
    '172.16.28': 3,  // Rochedo
    '172.16.29': 3,  // Rochedo
    '172.16.3': 3,   // Rochedo
    '172.16.31': 3,   // Rochedo
    '172.16.32': 3,   // Rochedo
    '172.16.33': 3,   // Rochedo
    '172.16.34': 3,   // Rochedo
    '172.16.35': 3,   // Rochedo
    '172.16.36': 3,   // Rochedo
    '172.16.37': 3,   // Rochedo
    '172.16.38': 3,   // Rochedo
    '172.16.39': 3,   // Rochedo

    '172.16.4': 4,   // Barra dos Bugres
    '172.16.41': 4,  // Barra dos Bugres
    '172.16.42': 4,  // Barra dos Bugres
    '172.16.43': 4,  // Barra dos Bugres
    '172.16.44': 4,  // Barra dos Bugres
    '172.16.45': 4,  // Barra dos Bugres
    '172.16.46': 4,  // Barra dos Bugres
    '172.16.47': 4,  // Barra dos Bugres
    '172.16.48': 4,  // Barra dos Bugres
    '172.16.49': 4,  // Barra dos Bugres

    '127.0.0': 2,    // LOCALHOST
  };
  
  const unidade = map[prefix] ?? null;
  console.log("📍 Prefix:", prefix, "→ Unidade:", unidade);
  return unidade;
}
