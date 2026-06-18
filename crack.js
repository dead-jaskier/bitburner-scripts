/** @param {NS} ns */
export async function main(ns) {
    const targets = ns.args[0]
        ? [ns.args[0]]
        : ns.read('hosts.txt').split('\n').filter(h => h !== '' && h !== 'home');

    for (const target of targets) {
        ns.print('starting crack of ', target);

        ns.print('attempting bruteSSH ...');
        try { ns.brutessh(target); } catch {}

        ns.print('attempting FTPCrack ...');
        try { ns.ftpcrack(target); } catch {}

        const portsRequired = ns.getServerNumPortsRequired(target);
        const portsOpen     = [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject]
            .reduce((n, fn) => {
                try { fn(target); return n + 1; } catch { return n; }
            }, 0);

        if (portsRequired > portsOpen) {
            ns.tprint(`WARN: ${target} needs ${portsRequired} ports open, only have ${portsOpen} — skipping`);
            continue;
        }

        ns.nuke(target);
        ns.tprint(`OK: rooted ${target}`);
    }

    ns.tprint('crack complete');
}
