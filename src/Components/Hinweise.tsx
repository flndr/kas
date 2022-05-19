import React from 'react';

export const Hinweise = () => <>
    
    <p>
        Der KAP geht davon aus, dass du primär remote arbeiten willst. Dein Remote-Kontingent (RZ) wird
        daher vor deinem Vor-Ort-Kontingent (SZ) verbaucht. Sind alle Kontingente (RZ+SZ) ausgeschöpft
        wird auf "extern" (ISO) verbucht.
    </p>
    
    <p>Wie benutzt man den KAP? <br/>
        { '-->' } Aktuelle Reststunden eintragen, als Start-Tag "heute" nehmen und evtl.
        Urlaube/Termine eintragen. Wochenarbeitszeit gem. Arbeitsvertag einstellen!
        Tadaa. Bonuspunkte, wenn du mit den Werten rumspielst und schaust wie
        es sich ausgeht, damit du UND dein Arbeitgeber happy sind.
    </p>
    
    <p>Limitierungen</p>
    <ul>
        <li>Vor-Ort-Tage sind immer ganze Tage</li>
        <li>Externe Termine könnten nur 1-wöchentlich wiederholt werden</li>
        <li>Keine Überprüfung auf Termin-Überscheidungen</li>
        <li>Wochenende wird ignoriert</li>
        <li>Halbwegs mobile-friendly, aber nicht optimiert oder PWA</li>
        <li>Keine Input-Validierung für DAUs</li>
        <li>Maria Himmelfahrt manuell ausgeschlossen - gem. Prisma kein Feiertag. Gilt das für alle MAs? Weitere Feiertage?</li>
    </ul>
    
    <p>Datentschutz</p>
    
    <p>Hier gibts keinen Cookie-Banner weil nichts relevantes auf meinem Server gespeichert wird,
        da reine Frontend-App ohne Backend. Mein Provider legt - wie jeder andere - anonyme
        Access-Logs (IP + Timstamp) an. Ansonsten keinerlei Tracking-Gedöns.</p>
    <p>
        Deine Angaben werden im Local-Storage deines Browsers (unter dem Key "KAP") gecached. Das
        sieht außer dir und deinem Browser niemand. Du hast ja keinen Bock jedes mal alles neu
        einzugeben.
    </p>
    
    <p>Code kann hier eingesehen werden: <a
        href={ 'https://github.com/flndr/kas' }>https://github.com/flndr/kas</a></p>
    
    <p>Disclaimer</p>
    <p>Sollte irgendwas schief laufen mit deiner Planung, weil Fehler in der Anwendung - not my problem!
        Selber Schuld wenn man dubiose Internetangebote nutzt.</p>
    <p>Begrifflichkeiten, die man mit Firmen/Behörden in Zusammenhang
        bringen könnte, sind reiner Zufall - alles frei erfunden.</p>
    
    <p>Wünsche/Feedback?</p>
    <p>Ihr wisst wie ihr mich erreicht.</p>
</>;
