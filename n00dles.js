/**
 * n00dles.js — Hack the n00dles server for early-game money and hacking XP.
 *
 * Usage:
 *   run n00dles.js
 *
 * n00dles has a min security of 1 and a max money of $70k, making it the
 * easiest target in the game and ideal for levelling hacking skill from 1.
 * This script runs the classic weaken → grow → hack loop and is intentionally
 * kept simple so it fits in < 1.75 GB RAM (the home server's starting RAM).
 *
 * RAM cost breakdown (v2.6.x):
 *   ns.hack      0.1 GB
 *   ns.grow      0.15 GB
 *   ns.weaken    0.15 GB
 *   ns.sleep     0 GB
 *   ns.getServerSecurityLevel   0.1 GB
 *   ns.getServerMinSecurityLevel 0.1 GB
 *   ns.getServerMoneyAvailable  0.1 GB
 *   ns.getServerMaxMoney        0.1 GB
 *   base          1.6 GB
 *   ─────────────────────────────
 *   total  ≈      1.6 GB  ✓
 */

/** @param {NS} ns */
export async function main(ns) {
    const TARGET = "n00dles";

    // Thresholds that keep security low and money near max.
    const SECURITY_THRESHOLD = 5;   // weaken when level > min + this
    const MONEY_THRESHOLD    = 0.75; // grow when money < max * this

    ns.ui.openTail(); // open a log window so progress is visible

    while (true) {
        const secLevel    = ns.getServerSecurityLevel(TARGET);
        const minSec      = ns.getServerMinSecurityLevel(TARGET);
        const money       = ns.getServerMoneyAvailable(TARGET);
        const maxMoney    = ns.getServerMaxMoney(TARGET);

        if (secLevel > minSec + SECURITY_THRESHOLD) {
            ns.print(`[weaken] sec ${secLevel.toFixed(2)} → target ≤ ${(minSec + SECURITY_THRESHOLD).toFixed(2)}`);
            await ns.weaken(TARGET);
        } else if (money < maxMoney * MONEY_THRESHOLD) {
            ns.print(`[grow]   $${ns.formatNumber(money)} / $${ns.formatNumber(maxMoney)}`);
            await ns.grow(TARGET);
        } else {
            ns.print(`[hack]   $${ns.formatNumber(money)} available`);
            await ns.hack(TARGET);
        }
    }
}
