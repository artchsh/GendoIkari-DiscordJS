const {
	VoiceState
} = require('discord.js')
const Enmap = require('enmap');

module.exports = async (client, oldState, newState) => {
	/**
	 * @param {VoiceState} oldState
	 * @param {VoiceState} newState
	 */
	const oldChannelId = oldState.channelId
	const newChannelId = newState.channelId
	const memberId = oldState.id
	const serverId = oldState.guild.id
	const afkChannelId = oldState.guild.afkChannelId

	//////////////////////////////////////
	//	VoiceState stats for profile  ///
	/////////////////////////////////////

	dbTime = new Enmap("Profile");
	const key = `${serverId}-${memberId}`;

	if (oldChannelId == null) {
		if (newChannelId != afkChannelId) {
			// further commands for joined channel here
			const joinTimeStamp = Date.now()
			dbTime.set(key, joinTimeStamp, "joinedTimestamp")
		} else {
			return
		}
	} else if (newChannelId == null) {
		if (oldChannelId != afkChannelId) {
			// further commands for leave channel here
			const leaveTimeStamp = Date.now()
			const joinTimestamp = dbTime.get(key, "joinedTimestamp")
			let sessionTimeMinutesWithDot = (leaveTimeStamp - joinTimestamp) / 60000
			let sessionTimeMinutes = Math.floor(sessionTimeMinutesWithDot)
			const memberVoiceMinutes = dbTime.get(key,"voiceMinutes")
			const memberVoiceHours = dbTime.get(key,"voiceHours")
			let totalMinutes = sessionTimeMinutes + memberVoiceMinutes
			if (totalMinutes > 59) {
				do {
					memberVoiceHours += 1
					totalMinutes -= 60
				} while (totalMinutes > 59)
			}
			dbTime.set(key, totalMinutes , "voiceMinutes")
			dbTime.set(key, memberVoiceHours, "voiceHours")
		} else {
			return
		}
	}

	//////////////////////////////////////
	//	         voiceCreate          ///
	/////////////////////////////////////
};