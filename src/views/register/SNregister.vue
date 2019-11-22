<template>
<!--三农注册-->
  <div class="register">
    <div class="top-bkg">
      <img src="../../../src/img/register/bkgsa.png" alt />
    </div>
    <div class="content">
      <md-input-container>
        <md-icon class="md-accent">people</md-icon>
        <label >用户名</label>
        <md-input v-model="name" required></md-input>
      </md-input-container>

      <md-input-container>
        <md-icon>phone</md-icon>
        <label>手机号</label>
        <md-input type="tel" v-model="tel"     required></md-input>
      </md-input-container>

      <md-layout md-gutter>
        <md-layout md-flex-medium="60">
          <md-input-container>
            <md-icon>edit</md-icon>
            <label>短信验证码</label>
            <md-input v-model="code" required></md-input>
          </md-input-container>
        </md-layout>
        <md-layout md-flex-medium="40">
          <md-button @click="getCode" class="md-raised md-warn" v-show="show">获取验证码</md-button>
          <md-button  class="md-raised md-warn" v-show="!show">{{count}} s</md-button>
        </md-layout>
      </md-layout>

      <md-input-container md-has-password>
        <md-icon>dialpad</md-icon>
        <label>密码</label>
        <md-input type="password" v-model="password" required></md-input>
      </md-input-container>

      <md-input-container>
        <md-icon class="md-primary">menu</md-icon>
        <label for="type" >注册类型</label>
        <md-select name="type" id="type" v-model="type" required>
          <md-option value="001">管理中心</md-option>
          <md-option value="002">被监督单位</md-option>
          <md-option value="003">监督员</md-option>
        </md-select>
      </md-input-container>


        <!--软件协议-->
      <div>
           <input type="checkbox" class="zctk"  v-model="checkbox" Style="zoom: 100%" >
        <md-dialog-alert class="zc"  style="height:100%"
             :md-dialog-title="alert.title"
             :md-content-html="alert.content"
             :md-ok-text="alert.ok"
             @open="onOpen"
             @close="onClose"
              ref="dialog3">
        </md-dialog-alert>
      <label class="zctkl">已阅读并同意
        <a class="md" @click="openDialog('dialog3')">《软件许可及服务协议》</a>
        </label>
      </div>








      <div class="reg-btn">
        <md-button class="md-raised md-primary">
          <div class="reg-btn-con" @click="saveInsuser">注 册</div>
        </md-button>
      </div>

 

    </div>
  </div>
</template>>
<script>
import qs from "qs";
import axios from "axios";
const ICONS = [
  "menu",
  "dashboard",
  "verified_user",
  "videogame_asset",
  "assessment",
  "invert_colors",
  "cloud_download"
];
const ICONCOLOR = [
  { color: "red-700-0.8" },
  { color: "green" },
  { color: "indigo" },
  { color: "blue-700-0.8" },
  { color: "lime" },
  { color: "teal" },
  { color: "green-600-0.5" }
];
export default {
  data() {
    return {
      name:"",
      tel: "",
      code: "",
      password: "",
      type: "002",
      existence: "",
      smsRUL:'https://www.bip-soft.com/ssms/',
      smsTitle:'华泰益兴科技',
      show: true,
      count: '',
      timer: null,
      checkbox:false,
      alert: {
        title:"服务协议",
      content: '<title>软件许可及服务协议</title>'
      +' <strong>特别提示：</strong>'
      +'<p>您在使用本公司提供的各项服务之前，请您务必审慎阅读本协议各条款内容，确保您充分理解本协议中各条款。您的注册、登录、使用等行为将视为对本协议的接受,并同意接受本协议各项条款的约束。如您不同意本服务协议或对本协议中的条款存在任何疑问，请您立即停止用户注册程序,并可以选择不使用本公司服务。本协议条款是本公司对用户相关政策的许诺,请您务必仔细阅读。</p>'
      +'<strong>一、用户须知</strong>'
+'<p>1. 用户可以使用各个频道、产品的单项服务，当用户使用各单项服务时，用户的使用行为视为其对该单项服务的服务条款以及本在该单项服务中发出的各类公告的同意。'
+'</p>'
+'<p>'
+'2. 用户协议以及各个频道、产品单项服务条款和公告可由本公司随时更新，且无需另行通知。您在使用相关服务时,应关注并遵守其所适用的相关条款。'
+'</p>'

+'<strong>二、帐号注册与使用</strong>'
+'<p>您使用部分产品或服务时需要注册帐号，当您注册和使用本帐号时应遵守下述要求：</p>'
+'<p>1. 用户注册成功后，本公司将给予每个用户一个用户帐号，用户可以自主设置帐号密码。该用户帐号和密码由用户负责保管；用户应当对以其用户帐号进行的所有活动和事件负法律责任。'
+'</p><p>'
+'2. 您按照注册页面提示填写信息、阅读并同意本协议且完成全部注册程序后，除本平台的具体产品对帐户有单独的注册要求外，您可获得本平台帐号并成为本用户，可通过本帐户使用本平台的各项产品和服务。'
+'</p><p>'
+'3. 本帐号的所有权归本公司，用户按注册页面引导填写信息，阅读并同意本协议且完成全部注册程序后，即可获得本帐号并成为用户。用户应提供及时、详尽及准确的个人资料，并不断更新注册资料，符合及时、详尽准确的要求。所有原始键入的资料将引用为注册资料。如果因注册信息不真实或更新不及时而引发的相关问题，本公司不负任何责任。您可以通过本帐号设置页面查询、更正您的信息，用户应当通过真实身份信息认证注册帐号，且用户提交的帐号名称、头像和简介等注册信息中不得出现违法和不良信息，经本公司审核，如存在上述情况，本公司将不予注册；同时，在注册后，如发现用户以虚假信息骗取帐号名称注册，或其帐号头像、简介等注册信息存在违法和不良信息的，本公司有权不经通知单方采取限期改正、暂停使用、注销登记、收回等措施。'
+'</p><p>'
+'4. 基于国家法律法规的规定要求或者本服务政策的要求，您在使用某些本服务时需要填写真实的姓名、身份证号等信息。若您填写的信息不完整、不正确，则可能无法使用相应服务或在使用过程中受到限制。'
+'</p><p>'
+'5. 当您使用验证功能时，我们会收集并保存您的信息。您应按照页面的提示完成相应动作，系统判断您的动作符合要求后，即可完成。您同意仅限您本人为您本人所持有的账户使用验证服务。为了提高验证的准确性，您同意本公司可在必要时将您提供的信息进行比对核验。'
+'</p><p>'
+'6. 本帐号包括帐户名称和密码，您可使用设置的帐户名称（包括用户名、手机号）和密码登录；在帐号使用过程中，为了保障您的帐号安全基于不同的终端以及您的使用习惯，我们可能采取不同的验证措施识别您的身份。'
+'</p><p>'
+'7. 用户不应将其帐号、密码转让、出售或出借予他人使用，帐号使用权仅属于初始申请注册人，用户应对帐号内的全部行为独立承担全部责任。如因帐号转让、买卖或出借导致的帐号纠纷或本无法判断帐号归属等情况，本有权拒绝提供帐号找回，并视情况采取冻结帐号、封禁帐号等措施。'
+'</p><p>'
+'8. 因您个人原因导致的帐号无法使用，如需找回帐号，请按照帐号找回要求提供相应的信息，并确保提供的信息合法真实有效，若提供的信息不符合要求或帐号的唯一凭证不再有效，无法通过本公司安全验证，因存在帐号被盗等安全风险导致无法判断帐号归属，本公司有权拒绝提供帐号找回服务，并视情况采取冻结帐号、封禁帐号等措施。您本帐号下绑定的手机号如因您个人原因停止使用，请尽快更改本帐号的绑定手机，否则如遇运营商二次放号，二次放号的用户可以通过您原来的手机号进行验证登录，可查看到您的全部帐号信息及产品使用信息，您的本帐号将无法继续使用，帐号内个人信息也有泄露的风险，请您务必及时更换绑定手机，如因未及时换绑手机号导致帐号丢失或个人信息泄露的责任由您自行承担，本公司有权拒绝提供帐号找回服务，并视情况采取冻结帐号、封禁帐号等措施。'
+'</p><p>'
+'9. 在需要终止使用本帐号服务时，符合以下条件的，您可以申请注销您的本帐号。'
+'</p>'

+'<p>'
+'（1）您仅能申请注销您本人的帐号，并依照本公司的流程进行注销；'
+'</p><p>'
+'（2）您仍应对您在注销帐号前且使用本公司服务期间的行为承担相应责任，同时本公司仍可保存您注销前的相关信息；'
+'</p><p>'
+'（3）注销成功后，帐号信息、个人身份证信息、交易记录、会员权益等将无法恢复或提供。'
+'</p>'
+'<p>'
+'10. 为了防止资源占用，如您连续六个月未使用您的本帐号或未通过本公司认可的其他方式登录过您的本帐户，本公司有权对该帐户进行注销，您将不能再通过该帐号登录名登录本网站或使用相关服务。如该帐户有关联的理财产品、待处理交易或余额，本公司会在合理范围内协助您处理，请您按照本公司提示的方式进行操作。'
+'</p><p>'
+'11. 我们将按照本公司的隐私权保护声明，使用您在注册本帐户、使用本服务中提交、留存的信息。您保证在您使用本公司的所有产品和服务前，已经充分了解并同意本公司可以据此处理用户信息。'
+'</p><p>'
+'12. 为了满足相关法律法规的要求和保障您的帐号安全，尤其是您在进行帐号解绑、注销等敏感操作时，我们会将您提交的个人身份信息进行验证查询，以核实您身份的真实性。'
+'</p><p>'
+'13. 当用户使用一键登录功能时，运营商会将用户的手机号传输给本公司，用以本公司判断您的手机号是否已注册本帐号。如您的手机号已注册本帐号，并通过安全验证，则您将无需填写手机号、验证码、帐户名、密码等，可直接完成帐号登录。如您不满足一键登录的要求，或者选取了其他登录方式，您可使用其他登录方式进行帐号登录。'
+'</p>'

+'<strong>三、使用规则</strong>'
+'<p>1. 用户在使用本公司的服务时，必须遵守《网络安全法》等中华人民共和国相关法律法规的规定，用户应同意将不会利用本服务进行任何违法或不正当的活动，包括但不限于下列行为:'
+'</p>'
+'<p>'
+'（1）上载、展示、张贴、传播或以其它方式传送含有下列内容之一的信息：</p><p>'
　+'　1）反对宪法所确定的基本原则的；</p><p>'
　　+'2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p><p>'
　　+'3）损害国家荣誉和利益的；</p><p>'
　　+'4）煽动民族仇恨、民族歧视、破坏民族团结的；</p><p>'
　　+'5）破坏国家宗教政策，宣扬邪教和封建迷信的；</p><p>'
　　+'6）散布谣言，扰乱社会秩序，破坏社会稳定的；</p><p>'
　　+'7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p><p>'
　　+'8）侮辱或者诽谤他人，侵害他人合法权利的；</p><p>'
　　+'9）含有虚假、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、或其它道德上令人反感的内容；</p><p>'
　　+'10）含有中国法律、法规、规章、条例以及任何具有法律效力之规范所限制或禁止的其它内容的；</p><p>'
+'</p>'
+'<p>'
+'（2）不得为任何非法目的而使用网络服务系统；'
+'</p>'
+'<p>'
+'（3）不利用本公司的服务从事以下活动：'
+'</p><p>'
　+'　1) 未经允许，进入计算机信息网络或者使用计算机信息网络资源的；'
+'</p><p>'
　+'　2) 未经允许，对计算机信息网络功能进行删除、修改或者增加的；'
+'</p><p>'
　+'　3) 未经允许，对进入计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加的；'
+'</p><p>'
　+'　4) 故意制作、传播计算机病毒等破坏性程序的；'
+'</p><p>'
　+'　5) 其他危害计算机信息网络安全的行为。'
+'</p>'
+'<p>'
+'2. 用户违反本协议或相关的服务条款的规定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的律师费，您同意赔偿本公司与合作公司、关联公司，并使之免受损害。对此，本公司有权视用户的行为性质，采取包括但不限于删除用户发布信息内容、暂停使用许可、终止服务、限制使用、回收本帐号、追究法律责任等措施。对恶意注册本帐号或利用本帐号进行违法活动、捣乱、骚扰、欺骗、其他用户以及其他违反本协议的行为，本公司有权回收其帐号。同时，本公司会视司法部门的要求，协助调查。'
+'</p><p>'
+'3. 用户不得对本公司服务任何部分或服务的使用或获得，进行复制、拷贝、出售、转售或用于任何其它商业目的。'
+'</p><p>'
+'4. 用户须对自己在使用本公司服务过程中的行为承担法律责任。用户承担法律责任的形式包括但不限于：对受到侵害者进行赔偿，以及在本公司首先承担了因用户行为导致的行政处罚或侵权损害赔偿责任后，用户应给予本公司等额的赔偿。'
+'</p>'
+'<p>'
+'5. 用户在使用本公司服务时遵守以下互联网底线：</p>'
+'<p>'
　+'　1）法律法规底线'
+'</p>'
+'<p>'
　+'　2）社会主义制度底线'
+'</p>'
+'<p>'
　+'　3）国家利益底线'
+'</p>'
+'<p>'
　+'　4）公民合法权益底线'
+'</p>'
+'<p>'
　+'　5）社会公共秩序底线'
+'</p>'
+'<p>'
　+'　6）道德风尚底线'
+'</p>'
 +'<p>'
   +'7）信息真实性底线'
+'</p> '

+'<strong>四、服务内容</strong>'
+'<p>'
+'1. 本公司网络服务的具体内容由本公司根据实际情况提供。'
+'</p><p>'
+'2. 除非服务协议另有其它明示规定，本公司所推出的新产品、新功能、新服务，均受到本服务协议之规范。'
+'</p><p>'
+'3. 为使用本服务，您必须能够自行经有法律资格对您提供互联网接入服务的第三方，进入国际互联网，并应自行支付相关服务费用。此外，您必须自行配备及负责与国际联网连线所需之一切必要装备，包括计算机、数据机或其它存取装置。'
+'</p>'

+'<strong>五、知识产权和其他合法权益</strong>'
+'<p>'
+'1. 用户权利保护'
+'</p><p>'
+'若您认为他人帐号（包括帐号的头像、用户名、昵称、简介）的使用侵犯了您的合法权益，请按照以下说明向本公司提供资料∶'
+'</p><p>'
+'请注意：如果权利通知的陈述失实，权利通知提交者将承担对由此造成的全部法律责任（包括但不限于赔偿各种费用及律师费）。如果上述个人或单位不确定网络上可获取的资料是否侵犯了其知识产权和其他合法权益，本公司建议该个人或单位首先咨询专业人士。'
+'</p><p>'
+'为了本公司有效处理上述个人或单位的权利通知，请使用以下格式（包括各条款的序号）：'
+'</p><p>'
+'1）权利人对涉嫌侵权内容拥有合法权益的权属证明；'
+'</p><p>'
+'2）请充分、明确地描述被侵犯了合法权益的情况并请提供涉嫌侵权的第三方帐号信息（包括用户名、昵称、头像、简介）和网址。'
+'</p><p>'
+'3）请指明涉嫌侵权帐号的哪些内容侵犯了第2项中列明的权利。'
+'</p><p>'
+'4）请提供权利人具体的联络信息，包括姓名、身份证等（对个人）、单位登记证明复印件（对单位）、通信地址、电话号码、传真和电子邮件。'
+'</p><p>'
+'5）请在此通知中加入如下关于通知内容真实性的声明： “我保证，本通知中所述信息是充分、真实、准确的，如果通知内容不完全属实，用户将承担由此产生的一切法律责任。”'
+'</p><p>'
+'6）请您签署该文件，如果您是依法成立的机构或组织，请您加盖公章。'
+'</p><p>'
+'请您把以上资料的原件扫描件发送至'
+'</p><p>'
+'【特别注意：邮箱仅接受关于本帐号（即仅限于帐号头像、昵称、用户名、简介）的侵权投诉。如您有关于非本帐号产品的投诉，请按照本权利声明或具体产品公示的投诉路径进行投诉。'
+'</p><p>'
+'如您有针对本产品的版权侵权投诉，请您至本版权平台进行投诉。】'
+'</p><p>'
+'2.　对于用户通过本公司服务上传到本公司网站上可公开获取区域的任何内容，用户同意本公司在全世界范围内具有免费的、永久性的、不可撤销的、非独家的和完全再许可的权利和许可，以使用、复制、修改、改编、出版、翻译、据以创作衍生作品、传播、表演和展示此等内容（整体或部分），和/或将此等内容编入当前已知的或以后开发的其他任何形式的作品、媒体或技术中。'
+'</p><p>'
+'3. 本公司拥有本网站内所有资料的版权。任何被授权的浏览、复制、打印和传播属于本网站内的资料必须符合以下条件：'
+'</p><p>'
　+'　所有的资料和图像均以获得信息为目的；'
+'</p><p>'
　+'　所有的资料和图像均不得用于商业目的；'
+'</p><p>'
　+'　所有的资料、图像及其任何部分都必须包括此版权声明；'
+'</p><p>'
　+'　本网站所有的产品、技术与所有程序均属于本公司知识产权，在此并未授权。相关图形等为本公司的注册商标。'
+'</p><p>'
+'未经本公司许可，任何人不得擅自（包括但不限于：以非法的方式复制、传播、展示、镜像、上传、下载）使用。否则，本公司将依法追究法律责任。'
+'</p>'

+'<strong>六、免责声明</strong>'
+'<p>1. 因以下情况造成网络服务在合理时间内的中断，本公司无需为此承担任何责任；'
  +'  </p><p>'
+'（1）本公司需要定期或不定期地对提供网络服务的平台或相关的设备进行检修或者维护，本公司保留不经事先通知为维修保养、升级或其它目的暂停本服务任何部分的权利。'
+'</p><p>'
+'（2）因台风、地震、洪水、雷电或恐怖袭击等不可抗力原因；'
+'</p><p>'
+'（3）用户的电脑软硬件和通信线路、供电线路出现故障的；'
+'</p><p>'
+'（4）因病毒、木马、恶意程序攻击、网络拥堵、系统不稳定、系统或设备故障、通讯故障、电力故障、银行原因、第三方服务瑕疵或政府行为等原因。'
+'尽管有前款约定，本公司将采取合理行动积极促使服务恢复正常。'
+'</p><p>'
+'2. 本服务或第三人可提供与其它国际互联网上之网站或资源之链接。由于本公司无法控制这些网站及资源，您了解并同意，此类网站或资源是否可供利用，本公司不予负责，存在或源于此类网站或资源之任何内容、广告、产品或其它资料，本公司亦不予保证或负责。因使用或依赖任何此类网站或资源发布的或经由此类网站或资源获得的任何内容、商品或服务所产生的任何损害或损失，本公司不承担任何责任。'
+'</p><p>'
+'3. 用户明确同意其使用本公司网络服务所存在的风险将完全由其自己承担。用户理解并接受下载或通过本公司服务取得的任何信息资料取决于用户自己，并由其承担系统受损、资料丢失以及其它任何风险。本公司对在服务网上得到的任何商品购物服务、交易进程、招聘信息，都不作担保。'
+'</p><p>'
+'4. 鉴于网络服务的特殊性，用户同意本公司有权不经事先通知，随时变更、中断或终止部分或全部的网络服务（包括收费网络服务）。本公司不担保网络服务不会中断，对网络服务的及时性、安全性、准确性也都不作担保。'
+'</p><p>'
+'5. 本公司有权于任何时间暂时或永久修改或终止本服务（或其任何部分），而无论其通知与否，本公司对用户和任何第三人均无需承担任何责任。'
+'</p>'

+'<strong>七、 终止服务</strong>'
+'<p>您同意本公司的基于其自行之考虑，因任何理由，包含但不限于长时间（超过一年）未使用，或本公司认为您已经违反本服务协议，终止您的密码、帐号或本服务之使用（或服务之任何部分），并将您在本服务内任何内容加以移除并删除。您同意依本服务协议任何规定提供之本服务，无需进行事先通知即可中断或终止，您承认并同意，本公司可立即关闭或删除您的帐号及您帐号中所有相关信息及文件，及/或禁止继续使用前述文件或本服务。此外，您同意若本服务的使用被中断或终止或您的帐号及相关信息和文件被关闭或删除，本公司对您或任何第三人均不承担任何责任。'
+'</p>'
+'<strong>八、其他</strong>'
+'<p>'
+'1. 本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。'
+'</p><p>'
+'2. 如双方就本协议内容或其执行发生任何争议，双方应尽量友好协商解决；协商不成时，任何一方均可向本公司所在地法院提起诉讼。'
+'</p><p>'
+'3. 本公司未行使或执行本服务协议任何权利或规定，不构成对前述权利或权利之放弃。'
+'</p><p>'
+'4. 如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。'
+'</p><p>'
+'5. 欢迎您使用本公司各平台服务，并在本协议基础上，同时遵守单项服务协议的具体约定。'
+'</p>' 
      ,
      ok: '关闭'
    },
    };

    
  },
  created() {
    this.loginRemote();
    console.log("cc");
  },

  mounted() {},
  methods: {
    //保存、登录、修改密码
    async saveLonginUppwd(){
      
      await this.saveInsuData();
      await this.loginRemote1();
      await this.upPwd()
    },
    // 登录方法
     async loginRemote() {
      var logindata = {
        apiId: global.APIID_OUTLOGIN,
        dbid: global.DBID,
        usercode: "100003", //用户名
        ioutsys: 1 //天心选择web端 钉钉。。。
      };
      try {
        var res = await this.getDataByAPINew(logindata);

        if(res.data.id ==0){
          var userI = res.data.data.user;
          var mlist = res.data.data.menulist;
          var snkey = res.data.data.snkey;
          window.sessionStorage.setItem('user', JSON.stringify(userI));
          window.sessionStorage.setItem('menulist', JSON.stringify(mlist));
          window.sessionStorage.setItem('snkey', JSON.stringify(snkey));
          this.$emit('dingLogin');
        }
        return res;
      } catch (e) {
        console.log(e);
        this.$notify.danger({ content: "系统连接错误！！" });
      }
    },
 // 再次登录方法
     async loginRemote1() {
      console.log("再次登录成功")
      var logindata = {
        apiId: global.APIID_OUTLOGIN,
        dbid: global.DBID,
        usercode:this.tel, //用户名
        ioutsys: 1 //天心选择web端 钉钉。。。
      };
      try {
        var res = await this.getDataByAPINew(logindata);
        this.$emit('dingLogin');
        var userI = res.data.data.user;
        var mlist = res.data.data.menulist;
        var snkey = res.data.data.snkey;
        window.sessionStorage.setItem('user', JSON.stringify(userI));
        window.sessionStorage.setItem('menulist', JSON.stringify(mlist));
        window.sessionStorage.setItem('snkey', JSON.stringify(snkey));
        return res;
      } catch (e) {
        console.log(e);
        this.$notify.danger({ content: "系统连接错误！！" });
      }
    },

    
    openDialog(ref) {
      this.$refs[ref].open();
    },
    closeDialog(ref) {
      this.$refs[ref].close();
    },
    onOpen() {
      console.log('Opened');
    },
    onClose(type) {
      console.log('Closed', type);
    },
   













        




    // (1)用户对象保存
    async saveInsuser() {
      // 1.校验字段是否为空
      let _this = this;
      if (this.name == "") {
        _this.$notify.danger({ content: "用户名不能为空" });
      } else if (this.tel == "") {
        _this.$notify.danger({ content: "手机号不能为空" });
      } else if (this.code == "") {
        _this.$notify.danger({ content: "短信验证码不能为空" });
      } else if (this.password == "") {
        _this.$notify.danger({ content: "密码不能为空" });
      } else if (this.type == "") {
        _this.$notify.danger({ content: "注册类型不能为空" });
      }else if (this.checkbox == false) {
        _this.$notify.danger({ content: "是否同意服务协议" });
      }
       else {
        // 2.校验手机号码是否存在
          
        await this.getTel();
        if (this.existence > 0) {
            _this.$notify.danger({ content: "该手机号已被注册" });
        } 
         else {
         // 3.校验验证码是否正确
          const url = this.smsRUL+"ckxcode";
           let posParams = {tels:this.tel,xcode:this.code};
           await axios.post(url, qs.stringify(posParams)).then(res=>{
             if(res.data.type!=0){
              _this.$notify.danger({ content: res.data.info });
             }
             else{
           this.saveLonginUppwd()
             }
           })
           .catch(err=>{
             console.log(err)
           })
         }
      }
    },
    //(2) 检查手机号是否存在
     async getTel() {
      let data2 = {
        dbid: global.DBID,
        usercode: "100003",
        apiId: global.APIID_AIDO,
        page: 1,
        assistid: "SOPRTEL", //辅助名称
        currentPage: 1, //页数
        pageSize: 20, //每页条数
        cont: "~usrcode=" + "'" + this.tel + "'"
      };
       await this.getDataByAPINewSync(data2).then(res => {
        this.existence = res.data.total;
      });
    },
      // 判断是否为手机号  
        isPhone(tel) {  
            var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;  
            if (phoneReg.test(tel)) {  
             return true;  
            } else {  
          return false;  
           }       
        },  


    // 保存账户信息
    saveInsuData() {
      let jsonstr = {
        usrname: this.name,
        usrcode: this.tel,
        tel: this.tel,
        gwcode: this.type,
        orgcode: "2",
        usrattr: "3",
        dlstate:1,
        password:'yVZncpbC'
      };
      console.log(jsonstr);
      var data1 = {
        dbid: `${global.DBID}`,
        usercode: "100003",
        apiId: "savedata",
        pcell: "6003", // 对象标识
        jsonstr: JSON.stringify(jsonstr),
        datatype: 1
      };
      let _this = this;
      axios
        .post(`${global.BIPAPIURL}` + `${global.API_COM}`, qs.stringify(data1))
        .then(res => {
          if (res.data.id == 0) {
            _this.$notify.success({ content: "保存成功" });
            // 页面跳转

            this.change()
          } else {
            _this.$notify.danger({ content: "保存失败" });
          }
        })
        .catch(err => {
          console.log(err);
          _this.$notify.danger({ content: "系统故障！" });
          _this.loading = 0;
        });

        this.upPwd();
    },
    // 更新账户密码
    async upPwd(){
        var uppwddata = {
            apiId: global.APIID_UPMYPWD,
            dbid: global.DBID,
            usercode: this.tel,//需要修改密码的用户
            oldPwd: this.base64Encode("123456"),
            newPwd: this.base64Encode(this.password),
        } 
        var res = await this.getDataByAPINew(uppwddata);
        console.log("密码更新");
        console.log(res)
       
    },
    async  change(){
       if(this.type == '001'){
          await this.$router.push({  
          path:'/agent',   //跳转的路径
          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
            tel : this.tel,
           name : this.name

          }
        })
       }else if (this.type == '002'){
         await this.$router.push({  
          path:'/company',   //跳转的路径
          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
            tel : this.tel,
            name : this.name
          }
        })
       }else  if(this.type == '003'){
         await this.$router.push({  
          path:'/check',   //跳转的路径
          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
            tel : this.tel
          }
        })
       }
      
    },
    //获取短信验证码
    async  getCode (){
      if (this.tel == "") {
        this.$notify.danger({ content: "手机号不能为空" });
        return;
      }
        var isPh= this.isPhone(this.tel);
      if(isPh==false){
         this.$notify.danger({ content: "手机号输入错误" });
           return;
          // console.log("号码错误");
      }
         await this.getTel();
        if (this.existence > 0) {
            this.$notify.danger({ content: "该手机号已被注册" });
            console.log('5555555s');
            return
        } 
        console.log('5555555s');


      const url = this.smsRUL+"/xcode";
      let posParams = {tels:this.tel,title:this.smsTitle,fhxcode:0};
      axios.post(url, qs.stringify(posParams)).then(res=>{
        if(res.data.type ==0){
          this.$notify.success({ content: res.data.info });
        }else{
          this.$notify.danger({ content: "验证码发送失败" });
        }
      })
      .catch(err=>{
        console.log(err)
      })
      const TIME_COUNT = 60;
     if (!this.timer) {
       this.count = TIME_COUNT;
       this.show = false;
       this.timer = setInterval(() => {
       if (this.count > 0 && this.count <= TIME_COUNT) {
         this.count--;
        } else {
         this.show = true;
         clearInterval(this.timer);
         this.timer = null;
        }
       }, 1000)
      }
    }
      
    
  }
};
</script>
<style >
.register {
  width: 100%;
  height: 100%;
}
.top-bkg {
  width: 100%;

}
img{
  width: 100%;
}
.content {
  margin: 10px;



}
.lable {
  margin-right: 10px;
}
.reg-btn {
  margin-top: 10px;
  text-align: center;
}
.reg-btn-con {
  padding: 3px 80px;
}
.zctk{
  color: #6b6b6b;
  text-align: center;
  
}
.zctkl{
  color: #6b6b6b;
}
.zc{
  color: #6b6b6b;
}
</style>