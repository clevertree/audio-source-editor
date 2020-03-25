import FileService from "../../song/file/FileService";
import React from "react";
import GMESongFile from "../../song/file/GMESongFile";

const libGMESupport = new GMESongFile();
libGMESupport.init();

class GMEPlayerSynthesizer {
    constructor(config={}) {
        this.config = config;
    }

    connect(destination) {

    }

    async loadBuffer() {
        if(!this.fileBuffer) {
            const src = this.config.fileURL;
            const service = new FileService();
            this.fileBuffer = service.loadBufferFromURL(src);
            console.info("SPC Player loaded");
        }
        if(this.fileBuffer instanceof Promise)
            this.spcBuffer = await this.spcBuffer;
        return this.fileBuffer;
    }

    async loadGMEPlayer(destination) {
        const buffer = await this.loadBuffer();
        return libGMESupport.loadPlayerFromBuffer(destination.context, destination, buffer, 'file', {
            destination
        });
    }

    /** Initializing Audio **/

    async init(audioContext) {
        this.audioContext = audioContext;
        if (this.config.fileURL)
            await this.loadBuffer();
        console.info("SPC Player initialized");
    }

    /** Playback **/


    // Instruments return promises
    async play(destination, namedFrequency, startTime, duration, velocity) {
        const spcPlayer = await this.loadGMEPlayer(destination);
        this.spcPlayers.push(spcPlayer);

        let currentTime = destination.context.currentTime;
        startTime = startTime !== null ? startTime : currentTime;
        if(startTime > currentTime) {
            const waitTime = startTime - currentTime;
            await new Promise((resolve, reject) => setTimeout(resolve, waitTime * 1000));
        }
        // const commandFrequency = this.getFrequencyFromAlias(namedFrequency) || namedFrequency;
        // const max = spcPlayer.getMaxPlaybackPosition();
        if(startTime < currentTime) {
            const seekPos = (currentTime - startTime) * 1000;
            spcPlayer.seekPlaybackPosition(seekPos);
        }
        spcPlayer.play(destination);

        if(duration) {
            const waitTime = (startTime + duration) - destination.context.currentTime;
            await new Promise((resolve, reject) => setTimeout(resolve, waitTime * 1000));
            spcPlayer.pause();
        }
    }

    stopPlayback() {
        for(let i=0; i<this.spcPlayers.length; i++) {
            // this.spcPlayers[i].stop();
            this.spcPlayers[i].pause();
        }
        // this.spcPlayer.stop();

    }

    getFrequencyFromAlias(aliasName) {
        return null;
    }

    getCommandFrequency(command) {
        const keyNumber = this.getCommandKeyNumber(command);
        return 440 * Math.pow(2, (keyNumber - 49) / 12);
    }

    getCommandKeyNumber(command) {
        if (Number(command) === command && command % 1 !== 0)
            return command;
        if (!command)
            return null;

        const noteCommands = this.noteFrequencies; // ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
        let octave = command.length === 3 ? command.charAt(2) : command.charAt(1),
            keyNumber = noteCommands.indexOf(command.slice(0, -1));
        if (keyNumber < 3) keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1;
        else keyNumber = keyNumber + ((octave - 1) * 12) + 1;
        return keyNumber;
    }


    get noteFrequencies() {
        return ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    }

    // get instrumentID() {
    //     return this.getAttribute('data-id');
    // }

    // render(renderObject=null) {
    //     if(renderObject instanceof HTMLElement && renderObject.matches('asui-div')) {
    //         this.form = new GMEPlayerFormRenderer(renderObject, this);
    //     } else {
    //         throw new Error("Unknown renderer");
    //     }
    // }


}





/**
 * Used for all Instrument UI. Instance not necessary for song playback
 */
// class GMEPlayerRenderer {
//
//     /**
//      *
//      * @param {AudioSourceComposerForm} instrumentForm
//      * @param instruments
//      */
//     constructor(instrumentForm, instruments) {
//         this.form = instrumentForm;
//         this.instruments = instruments;
//         const root = instrumentForm.getRootNode() || document;
//         this.appendCSS(root);
//         this.render();
//     }
//
//     // get DEFAULT_SAMPLE_LIBRARY_URL() {
//     //     return getScriptDirectory('default.library.json');
//     // }
//
//
//
// //     appendCSS(rootElm) {
// //
// //         // Append Instrument CSS
// //         const PATH = 'instruments/chip/spc-player-synthesizer.css';
// //         const linkHRef = getScriptDirectory(PATH);
// // //             console.log(rootElm);
// //         let linkElms = rootElm.querySelectorAll('link');
// //         for(let i=0; i<linkElms.length; i++) {
// //             if(linkElms[i].href.endsWith(PATH))
// //                 return;
// //         }
// //         const linkElm = document.createElement('link');
// //         linkElm.setAttribute('href', linkHRef);
// //         linkElm.setAttribute('rel', 'stylesheet');
// //         rootElm.insertBefore(linkElm, rootElm.firstChild);
// //     }
//
//     /** Modify Instrument **/
//
//     remove() {
//         this.instruments.song.instrumentRemove(this.instruments.id);
//         // document.dispatchEvent(new CustomEvent('instruments:remove', this));
//     }
//
//     instrumentRename(newInstrumentName) {
//         return this.instruments.song.instrumentRename(this.instruments.id, newInstrumentName);
//     }
//
//     render() {
//         // const instruments = this.instruments;
//         const instrumentID = typeof this.instruments.id !== "undefined" ? this.instruments.id : -1;
//         const instrumentIDHTML = (instrumentID < 10 ? "0" : "") + (instrumentID);
//         this.form.innerHTML = '';
//         this.form.classList.add('spc-player-synthesizer-container');
//
//         // this.form.removeEventListener('focus', this.focusHandler);
//         // this.form.addEventListener('focus', this.focusHandler, true);
//
//         const instrumentToggleButton = this.form.addButtonInput('instruments-id',
//             e => this.form.classList.toggle('selected'),
//             instrumentIDHTML + ':'
//         );
//         instrumentToggleButton.classList.add('show-on-focus');
//
//         const instrumentNameInput = this.form.addTextInput('instruments-name',
//             (e, newInstrumentName) => this.instrumentRename(newInstrumentName),
//             'Instrument Name',
//             this.instruments.config.name || '',
//             'Unnamed'
//         );
//         instrumentNameInput.classList.add('show-on-focus');
//
//
//         this.form.addButtonInput('instruments-remove',
//             (e) => this.remove(e, instrumentID),
//             this.form.createIcon('delete'),
//             'Remove Instrument');
//
//         let defaultPresetURL = '';
//         if (this.instruments.config.libraryURL && this.instruments.config.preset)
//             defaultPresetURL = new URL(this.instruments.config.libraryURL + '#' + this.instruments.config.preset, document.location) + '';
//
//         this.fieldChangePreset = this.form.addSelectInput('instruments-preset',
//             (e, presetURL) => this.setPreset(presetURL),
//             (addOption, setOptgroup) => {
//                 addOption('', 'Change Preset');
//                 // setOptgroup(this.sampleLibrary.name || 'Unnamed Library');
//                 // this.sampleLibrary.getPresets().map(presetConfig => addOption(presetConfig.url, presetConfig.name));
//                 // setOptgroup('Libraries');
//                 // this.sampleLibrary.getLibraries().map(libraryConfig => addOption(libraryConfig.url, libraryConfig.name));
//                 // setOptgroup('Other Libraries');
//                 // const Library = customElements.get('audio-source-library');
//                 // Library.eachHistoricLibrary(addOption);
//             },
//             'Change Instrument',
//             defaultPresetURL);
//
//
//         this.form.addBreak();
//     }
// }

export default GMEPlayerSynthesizer;


