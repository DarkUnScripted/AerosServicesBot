const Discord = require("discord.js");
const client = new Discord.Client();
exports.run = (client, message, argument) => {
    const categoryId = "738086171472822294";
    const OrderID = "743744778629546075";
    const ApplicationID = "743745077808988290";
    const SupportID = "743745268695957525";
    const supportrole = message.guild.roles.cache.find(role => role.id = "743416557937623042");
    const BotDevRole = message.guild.roles.cache.find(role => role.id = "743741401480822805");
    const MCPluginDevRole = message.guild.roles.cache.find(role => role.id = "743741432187060314");
    const DesignerRole = message.guild.roles.cache.find(role => role.id = "743741492220264479");
    const WebDevRole = message.guild.roles.cache.find(role => role.id = "743741574399131668");
    const OrderChat = client.channels.cache.find(channel => channel.id === "751507089708548156")
    let NeededRole;
    let Budget;
    let Explanation;

    let UserName = message.author.username

    var bool = false;

    message.guild.channels.cache.forEach((channels) => {

        if (channels.name == "Ticket-" + UserName.toLowerCase()) {
            message.reply(", You already have a ticket");
            bool = true;
        }

    })

    if (bool === true) return;

    var embedCreateTicket = new Discord.MessageEmbed()
        .setTitle(`Hey ${message.author.username}`)
        .setDescription("Your ticket has been created!")
        .setTimestamp()
        .setFooter(`${message.guild.name}`);

    var embedOpenTicket = new Discord.MessageEmbed()
        .setTitle(`Ticket Opened`)
        .setDescription(`Ticket ticket-${UserName} has been openend!`)
        .setTimestamp()
        .setFooter(`${message.guild.name}`);

    var logChannel = message.guild.channels.cache.find(channel => channel.id === "743005578875502602");
    if (!logChannel) return message.channel.send("Could not logg the ticket");

    logChannel.send(embedOpenTicket);

    message.channel.send(embedCreateTicket).then((msg) => {
        msg.delete({ timeout: 10000 })
    })

    message.guild.channels.create(`Ticket-${UserName}`, "text").then((createdChan) => {

        createdChan.setParent(categoryId).then((settedParent) => {

            settedParent.createOverwrite(message.guild.id, {
                VIEW_CHANNEL: false
            });
            settedParent.createOverwrite(message.author.id, {
                VIEW_CHANNEL: true,
                ATTACH_FILES: true,
                SEND_MESSAGES: true,
                EMBED_LINKS: true
            });

            var embedParent = new Discord.MessageEmbed()
                .setTitle(`Hey ${message.author.username}`)
                .setDescription("**What do you need?**\n\n:receipt: | Order\n:tools: | Support\n:tickets: | Application")
                .setTimestamp()
                .setFooter(`${message.guild.name}`);

            settedParent.send(embedParent).then((msg) => {
                msg.react("🧾").then(msg.react("⚒️")).then(msg.react("🎫"))

                const filter = (reaction, user) => reaction.emoji.name === '🧾' && reaction.emoji.name === '🎫' && reaction.emoji.name === '⚒️' && user.id === message.author.id;
                client.on('messageReactionAdd', (reaction, user) => {
                    if (user.bot) return;
                    if (reaction.emoji.name === '⚒️') {
                        settedParent.setParent(SupportID);
                        msg.delete();
                        var SupportEmbed = new Discord.MessageEmbed()
                            .setTitle("Support")
                            .setDescription(`Hey ${message.author.username}! Describe your problem. someone of the staffteam will be here soon! `)
                            .setTimestamp()
                            .setFooter(`${message.guild.name}`);
                        settedParent.send(SupportEmbed)
                    } else if (reaction.emoji.name === '🧾') {
                        settedParent.setParent(OrderID);
                        msg.delete();
                        var OrderEmbed = new Discord.MessageEmbed()
                            .setTitle("Order")
                            .setDescription(`Hey ${message.author.username}!\n\nMention a role that you need\n\n**Roles**\n<@&743741401480822805>\n<@&743741432187060314>\n<@&743741492220264479>\n<@&743741574399131668>`)
                            .setTimestamp()
                            .setFooter(`${message.guild.name}`);
                        settedParent.send(OrderEmbed).then((msg) => {
                            const filter = reaction => reaction.author == message.author;
                            const collector = settedParent.createMessageCollector(filter, { max: 1});
                            collector.on('collect', m => {
                                if(m.content == "<@&743741401480822805>"){
                                    NeededRole = "<@&743741401480822805>";
                                    m.delete();
                                    msg.delete();
                                    var BudgetEmbed = new Discord.MessageEmbed()
                                        .setTitle(`Budget`)
                                        .setDescription(`What is your budget ${message.author.username}?`)
                                        .setTimestamp()
                                        .setFooter(`${message.guild.name}`)
                                    settedParent.send(BudgetEmbed).then((BudgetBericht) => {
                                        const filter = reaction => reaction.author == message.author;
                                        const collector = settedParent.createMessageCollector(filter, { max: 1});
                                        collector.on('collect', m => {
                                            if(isNaN(parseInt(m.content))) return
                                            Budget = m.content;
                                            m.delete();
                                            BudgetBericht.delete();
                                            var ExplanationEmbed = new Discord.MessageEmbed()
                                                .setTitle(`Description`)
                                                .setDescription(`Tell us what you want exactly ${message.author.username}.`)
                                                .setTimestamp()
                                                .setFooter(`${message.guild.name}`)
                                            settedParent.send(ExplanationEmbed).then((ExplanationEmbed) => {
                                                const filter = reaction => reaction.author == message.author;
                                                const collector = settedParent.createMessageCollector(filter, { max: 1});
                                                collector.on('collect', m => {
                                                    Explanation = m.content;
                                                    m.delete();
                                                    ExplanationEmbed.delete();
                                                    var FinalEmbed = new Discord.MessageEmbed()
                                                        .setTitle('Submit')
                                                        .setDescription(`${message.author.username}\n\n**Your answers:**\n\nNeeded Role:\n${NeededRole}\n\nBudget:\n${Budget}\n\nExplanation:\n${Explanation}\n\nDo you wanna submit? type submit to cancel write cancel (ticket will be closed)`)
                                                        .setTimestamp()
                                                        .setFooter(`${message.guild.name}`)
                                                    settedParent.send(FinalEmbed).then((finalMessage) => {
                                                        const filter = reaction => reaction.author == message.author && (reaction.content == "submit" || reaction.content == "cancel");
                                                        const collector = settedParent.createMessageCollector(filter, { max: 1});
                                                        collector.on('collect', m => {
                                                            if (m.content == "submit") {
                                                                finalMessage.delete();
                                                                m.delete();
                                                                var OrderSubmitted = new Discord.MessageEmbed()
                                                                    .setTitle("Order Submitted")
                                                                    .setDescription(`${message.author.username}, Your order has been submitted!\n Someone will claim it soon!`)
                                                                    .setTimestamp()
                                                                    .setFooter(`${message.guild.name}`)
                                                                settedParent.send(OrderSubmitted).then((submitembed) => {
                                                                    var OrderEmbed = new Discord.MessageEmbed()
                                                                        .setTitle("Order")
                                                                        .setDescription(`**Needed Role:**\n${NeededRole}\n\n**Budget:**\n${Budget}\n\n**Explanation**:\n${Explanation}`)
                                                                        .setTimestamp()
                                                                        .setFooter(`${message.guild.name}`)
                                                                        OrderChat.send(OrderEmbed).then((OrderChatEmbed) => {
                                                                        OrderChatEmbed.react('✅').then(() => {
                                                                            client.on('messageReactionAdd', (reaction, user) => {
                                                                                if (user.bot) return
                                                                                if (reaction.emoji.name == '✅') {
                                                                                    OrderChatEmbed.delete();
                                                                                    submitembed.delete();
                                                                                    var ClaimedEmbed = new Discord.MessageEmbed()
                                                                                        .setTitle("Claimed")
                                                                                        .setDescription(`${user.username} has claimed your order`)
                                                                                        .setTimestamp()
                                                                                        .setFooter(`${message.guild.name}`)
                                                                                    settedParent.send(ClaimedEmbed);
                                                                                    settedParent.createOverwrite(user.id, {
                                                                                        VIEW_CHANNEL: true,
                                                                                        ATTACH_FILES: true,
                                                                                        SEND_MESSAGES: true,
                                                                                        EMBED_LINKS: true
                                                                                    });
                                                                                }
                                                                            })
                                                                        })
                                                                    })

                                                                })
                                                            } else if(m.content == "cancel"){
                                                                finalMessage.delete();
                                                                m.delete();
                                                                settedParent.send("Closing ticket in 3 seconds!")
                                                                settedParent.delete({timeout: 3000});
                                                            }
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                }else if(m.content == "<@&743741432187060314>"){

                                }else if(m.content == "<@&743741492220264479>"){

                                }else if(m.content == "<@&743741574399131668>"){

                                }
                            })
                        })
                    }
                })
            })
        })
    })
}